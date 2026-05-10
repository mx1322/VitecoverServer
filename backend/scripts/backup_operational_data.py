#!/usr/bin/env python3
import argparse
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

import requests
import yaml

ROOT = Path(__file__).resolve().parents[2]
BACKEND_ROOT = ROOT / "backend"
POLICY_PATH = BACKEND_ROOT / "backup" / "backup-policy.yaml"
SCHEMA_TARGET_PATH = BACKEND_ROOT / "directus" / "schema" / "schema-target.json"

FORBIDDEN_COLLECTIONS = {
    "customers",
    "drivers",
    "vehicles",
    "quotes",
    "orders",
    "payments",
    "admin_reviews",
    "policies",
    "refunds",
    "directus_users",
}


def parse_env_file(path: Path) -> Dict[str, str]:
    if not path.exists():
        return {}

    parsed: Dict[str, str] = {}
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        parsed[key.strip()] = value.strip().strip('"').strip("'")
    return parsed


def load_env() -> Dict[str, str]:
    merged: Dict[str, str] = {}
    for env_path in [ROOT / ".env", BACKEND_ROOT / ".env", ROOT / "deploy/linux/.env.deploy"]:
        merged.update(parse_env_file(env_path))

    effective = merged.copy()
    effective.update({k: v for k, v in os.environ.items() if v is not None})
    return effective


def get_config(env: Dict[str, str]) -> Dict[str, Optional[str]]:
    directus_url = (env.get("DIRECTUS_URL") or env.get("PUBLIC_URL") or "http://localhost:8055").rstrip("/")
    token = env.get("DIRECTUS_TOKEN") or env.get("ADMIN_TOKEN")
    admin_email = env.get("DIRECTUS_ADMIN_EMAIL") or env.get("ADMIN_EMAIL")
    admin_password = env.get("DIRECTUS_ADMIN_PASSWORD") or env.get("ADMIN_PASSWORD")

    if not token and not (admin_email and admin_password):
        raise ValueError("Missing DIRECTUS_TOKEN/ADMIN_TOKEN or DIRECTUS_ADMIN_EMAIL + DIRECTUS_ADMIN_PASSWORD")

    return {
        "DIRECTUS_URL": directus_url,
        "TOKEN": token,
        "ADMIN_EMAIL": admin_email,
        "ADMIN_PASSWORD": admin_password,
    }


def load_policy() -> Dict[str, Any]:
    if not POLICY_PATH.exists():
        raise FileNotFoundError(f"Missing backup policy: {POLICY_PATH}")

    policy = yaml.safe_load(POLICY_PATH.read_text(encoding="utf-8")) or {}
    if "operational" not in policy:
        raise ValueError("backup-policy.yaml must contain 'operational'")

    collections = set(policy["operational"].get("collections", []))
    forbidden = sorted(collections.intersection(FORBIDDEN_COLLECTIONS))
    if forbidden:
        raise ValueError(f"Operational policy includes forbidden collections: {', '.join(forbidden)}")

    return policy


def login_for_token(config: Dict[str, Optional[str]]) -> str:
    if not config.get("ADMIN_EMAIL") or not config.get("ADMIN_PASSWORD"):
        raise ValueError("Missing DIRECTUS_ADMIN_EMAIL / DIRECTUS_ADMIN_PASSWORD")

    response = requests.post(
        f"{config['DIRECTUS_URL']}/auth/login",
        headers={"Content-Type": "application/json"},
        data=json.dumps({"email": config["ADMIN_EMAIL"], "password": config["ADMIN_PASSWORD"]}),
        timeout=60,
    )

    payload = response.json()
    if not response.ok:
        raise RuntimeError(f"Directus login failed ({response.status_code}): {json.dumps(payload, indent=2)}")

    token = payload.get("data", {}).get("access_token")
    if not token:
        raise RuntimeError("Directus login succeeded but access_token missing")
    return token


def api_request(config: Dict[str, Optional[str]], method: str, endpoint: str, payload: Any = None) -> Any:
    token = config.get("TOKEN") or login_for_token(config)
    config["TOKEN"] = token

    headers = {"Authorization": f"Bearer {token}"}
    kwargs: Dict[str, Any] = {"headers": headers, "timeout": 120}
    if payload is not None:
        headers["Content-Type"] = "application/json"
        kwargs["data"] = json.dumps(payload)

    response = requests.request(method, f"{config['DIRECTUS_URL']}{endpoint}", **kwargs)
    if response.status_code in {401, 403} and config.get("ADMIN_EMAIL") and config.get("ADMIN_PASSWORD"):
        token = login_for_token(config)
        config["TOKEN"] = token
        headers["Authorization"] = f"Bearer {token}"
        response = requests.request(method, f"{config['DIRECTUS_URL']}{endpoint}", **kwargs)

    try:
        body = response.json()
    except Exception:
        body = response.text

    if not response.ok:
        raise RuntimeError(f"HTTP {response.status_code} for {endpoint}: {body}")

    return body


def fetch_items(config: Dict[str, Optional[str]], collection: str) -> List[Dict[str, Any]]:
    items: List[Dict[str, Any]] = []
    offset = 0
    limit = 200
    while True:
        endpoint = f"/items/{collection}?limit={limit}&offset={offset}&sort=id"
        payload = api_request(config, "GET", endpoint)
        batch = payload.get("data", []) if isinstance(payload, dict) else []
        if not batch:
            break
        items.extend(batch)
        if len(batch) < limit:
            break
        offset += limit
    return items


def write_json(path: Path, value: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def read_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def get_operational_paths(policy: Dict[str, Any]) -> Dict[str, Path]:
    base = ROOT / policy["operational"].get("output_dir", "backend/directus/seed/operational")
    return {
        "base": base,
        "items": base / "items",
        "schema": base / "schema",
        "manifest": base / "manifest.json",
        "schema_snapshot": base / "schema" / "schema-snapshot.json",
    }


def fetch_directus_version(config: Dict[str, Optional[str]]) -> Optional[str]:
    try:
        payload = api_request(config, "GET", "/server/info")
        return payload.get("data", {}).get("version")
    except Exception:
        return None


def fetch_schema_snapshot(config: Dict[str, Optional[str]]) -> Any:
    payload = api_request(config, "GET", "/schema/snapshot")
    return payload.get("data") if isinstance(payload, dict) and "data" in payload else payload


def apply_schema_if_requested(config: Dict[str, Optional[str]], paths: Dict[str, Path]) -> None:
    schema_path = paths["schema_snapshot"]
    if not schema_path.exists():
        raise FileNotFoundError(f"Schema snapshot not found: {schema_path}")

    snapshot = read_json(schema_path)
    diff_payload = api_request(config, "POST", "/schema/diff?force=true", snapshot)
    diff_data = diff_payload.get("data", diff_payload)
    api_request(config, "POST", "/schema/apply", diff_data)


def backup_command(config: Dict[str, Optional[str]], policy: Dict[str, Any]) -> None:
    op = policy["operational"]
    paths = get_operational_paths(policy)

    exported_counts: Dict[str, int] = {}
    exported_collections: List[str] = []

    for collection in op.get("collections", []):
        if collection in FORBIDDEN_COLLECTIONS:
            raise ValueError(f"Refusing to export forbidden collection: {collection}")

        print(f"Exporting collection: {collection}")
        items = fetch_items(config, collection)
        write_json(paths["items"] / f"{collection}.json", items)
        exported_counts[collection] = len(items)
        exported_collections.append(collection)

    include_schema = bool(op.get("include_schema", True))
    if include_schema:
        print("Exporting schema snapshot...")
        schema = fetch_schema_snapshot(config)
        write_json(paths["schema_snapshot"], schema)

    manifest = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "directus_version": fetch_directus_version(config),
        "exported_collections": exported_collections,
        "item_count_per_collection": exported_counts,
        "schema_included": include_schema,
        "public_assets_included": bool(op.get("include_public_assets", False)),
        "warning": "Operational backups must never contain customer/private data.",
    }

    write_json(paths["manifest"], manifest)
    print(f"Operational backup completed: {paths['base']}")


def clear_collection(config: Dict[str, Optional[str]], collection: str) -> None:
    api_request(config, "DELETE", f"/items/{collection}?limit=-1")


def upsert_items(config: Dict[str, Optional[str]], collection: str, items: List[Dict[str, Any]]) -> None:
    if not items:
        return
    for item in items:
        item_id = item.get("id")
        if item_id is None:
            api_request(config, "POST", f"/items/{collection}", item)
            continue
        try:
            api_request(config, "PATCH", f"/items/{collection}/{item_id}", item)
        except Exception:
            api_request(config, "POST", f"/items/{collection}", item)


def restore_command(config: Dict[str, Optional[str]], policy: Dict[str, Any], replace: bool, apply_schema: bool) -> None:
    op = policy["operational"]
    paths = get_operational_paths(policy)

    if apply_schema:
        print("Applying schema from operational backup snapshot...")
        apply_schema_if_requested(config, paths)

    for collection in op.get("collections", []):
        if collection in FORBIDDEN_COLLECTIONS:
            raise ValueError(f"Refusing to restore forbidden collection: {collection}")

        source = paths["items"] / f"{collection}.json"
        if not source.exists():
            raise FileNotFoundError(f"Missing collection backup file: {source}")

        items = read_json(source)
        if not isinstance(items, list):
            raise ValueError(f"Invalid backup file format for {collection}: expected JSON list")

        print(f"Restoring collection: {collection} ({len(items)} items)")
        if replace:
            print(f"Replacing existing items in {collection} before import...")
            clear_collection(config, collection)

        upsert_items(config, collection, items)

    print("Operational restore completed.")


def verify_command(config: Dict[str, Optional[str]], policy: Dict[str, Any]) -> None:
    op = policy["operational"]
    paths = get_operational_paths(policy)

    manifest_exists = paths["manifest"].exists()
    if not manifest_exists:
        raise FileNotFoundError(f"Missing manifest: {paths['manifest']}")

    for collection in op.get("collections", []):
        if collection in FORBIDDEN_COLLECTIONS:
            raise ValueError(f"Forbidden collection found in operational policy: {collection}")

        print(f"Verifying API access for collection: {collection}")
        api_request(config, "GET", f"/items/{collection}?limit=1")

        path = paths["items"] / f"{collection}.json"
        if not path.exists():
            raise FileNotFoundError(f"Missing exported collection file: {path}")

    if op.get("include_schema", True) and not paths["schema_snapshot"].exists():
        raise FileNotFoundError(f"Missing schema snapshot: {paths['schema_snapshot']}")

    print("Operational backup verify passed.")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Operational Directus backup/restore helper")
    sub = parser.add_subparsers(dest="command", required=True)

    sub.add_parser("backup", help="Export operational collections and schema snapshot")

    restore = sub.add_parser("restore", help="Restore operational collections from exported files")
    restore.add_argument("--replace", action="store_true", help="Delete collection items before restore")
    restore.add_argument("--apply-schema", action="store_true", help="Apply schema snapshot before restore")

    sub.add_parser("verify", help="Verify policy, exported files, and collection access")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    env = load_env()
    config = get_config(env)
    policy = load_policy()

    if args.command == "backup":
        backup_command(config, policy)
    elif args.command == "restore":
        restore_command(config, policy, replace=args.replace, apply_schema=args.apply_schema)
    elif args.command == "verify":
        verify_command(config, policy)
    else:
        raise ValueError(f"Unknown command {args.command}")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("Cancelled.")
        sys.exit(1)
    except Exception as exc:
        print(f"Error: {exc}")
        sys.exit(1)

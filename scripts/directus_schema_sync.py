#!/usr/bin/env python3
import json
import os
import sys
from pathlib import Path
from typing import Any, Dict

import requests


ROOT = Path.cwd()
ENV_PATH = ROOT / ".env"
SCHEMA_DIR = ROOT / "directus" / "schema"
REMOTE_FILE = SCHEMA_DIR / "remote-latest.json"
LOCAL_FILE = SCHEMA_DIR / "local-working.json"
LIVE_TMP_FILE = SCHEMA_DIR / "live-current.tmp.json"


def parse_env_file(path: Path) -> Dict[str, str]:
    if not path.exists():
        raise FileNotFoundError(f"Missing .env file: {path}")

    env: Dict[str, str] = {}
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        env[key] = value
    return env


def get_config() -> Dict[str, str]:
    file_env = parse_env_file(ENV_PATH)

    directus_url = (
        os.getenv("DIRECTUS_URL")
        or file_env.get("DIRECTUS_URL")
        or file_env.get("PUBLIC_URL")
        or "http://localhost:8055"
    ).rstrip("/")

    token = (
        os.getenv("DIRECTUS_TOKEN")
        or os.getenv("ADMIN_TOKEN")
        or file_env.get("DIRECTUS_TOKEN")
        or file_env.get("ADMIN_TOKEN")
    )

    if not token:
        raise ValueError("Missing DIRECTUS_TOKEN or ADMIN_TOKEN in .env")

    return {
        "DIRECTUS_URL": directus_url,
        "TOKEN": token,
    }


def ensure_dir(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True)


def write_json(path: Path, value: Any) -> None:
    ensure_dir(path.parent)
    path.write_text(json.dumps(value, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def read_json(path: Path) -> Any:
    if not path.exists():
        return None
    return json.loads(path.read_text(encoding="utf-8"))


def api_request(config: Dict[str, str], method: str, endpoint: str, payload: Any = None) -> Any:
    url = f"{config['DIRECTUS_URL']}{endpoint}"
    headers = {
        "Authorization": f"Bearer {config['TOKEN']}",
    }

    kwargs: Dict[str, Any] = {"headers": headers, "timeout": 60}
    if payload is not None:
        headers["Content-Type"] = "application/json"
        kwargs["data"] = json.dumps(payload)

    response = requests.request(method=method, url=url, **kwargs)

    try:
        data = response.json()
    except Exception:
        data = response.text

    if not response.ok:
        raise RuntimeError(f"HTTP {response.status_code} {response.reason}\n{json.dumps(data, indent=2, ensure_ascii=False) if not isinstance(data, str) else data}")

    return data


def fetch_snapshot(config: Dict[str, str]) -> Any:
    payload = api_request(config, "GET", "/schema/snapshot")
    if isinstance(payload, dict) and "data" in payload:
        return payload["data"]
    return payload


def fetch_schema_diff(config: Dict[str, str], snapshot: Any, force: bool = False) -> Any:
    endpoint = "/schema/diff"
    if force:
        endpoint += "?force=true"
    return api_request(config, "POST", endpoint, snapshot)


def apply_schema_diff(config: Dict[str, str], diff_payload: Any) -> Any:
    return api_request(config, "POST", "/schema/apply", diff_payload)


def summarize_diff(diff_payload: Any) -> Dict[str, int]:
    if not isinstance(diff_payload, dict):
        return {"collections": 0, "fields": 0, "relations": 0, "changes": 0}

    collections = len(diff_payload.get("collections", []) or [])
    fields = len(diff_payload.get("fields", []) or [])
    relations = len(diff_payload.get("relations", []) or [])

    changes = 0
    for bucket in ("collections", "fields", "relations"):
        for entry in diff_payload.get(bucket, []) or []:
            changes += len(entry.get("diff", []) or [])

    return {
        "collections": collections,
        "fields": fields,
        "relations": relations,
        "changes": changes,
    }


def has_changes(diff_payload: Any) -> bool:
    summary = summarize_diff(diff_payload)
    return any(v > 0 for v in summary.values())


def print_summary(title: str, diff_payload: Any) -> None:
    s = summarize_diff(diff_payload)
    print(f"\n{title}")
    print(f"- collections touched: {s['collections']}")
    print(f"- fields touched:      {s['fields']}")
    print(f"- relations touched:   {s['relations']}")
    print(f"- raw diff entries:    {s['changes']}")


def print_diff_preview(diff_payload: Any, max_entries: int = 20) -> None:
    print("\nDiff preview:")
    printed = 0

    for bucket in ("collections", "fields", "relations"):
        for entry in diff_payload.get(bucket, []) or []:
            identifier = (
                f"{entry['collection']}.{entry['field']}"
                if entry.get("collection") and entry.get("field")
                else entry.get("collection")
                or entry.get("field")
                or entry.get("related_collection")
                or "(unknown)"
            )
            print(f"- [{bucket[:-1]}] {identifier}")

            for d in entry.get("diff", []) or []:
                if printed >= max_entries:
                    print(f"... truncated after {max_entries} diff lines")
                    return
                kind = d.get("kind", "?")
                path_value = ".".join(str(x) for x in d.get("path", [])) if isinstance(d.get("path"), list) else "(root)"
                print(f"    {kind} {path_value}")
                printed += 1

    if printed == 0:
        print("- no detailed diff lines")


def confirm(question: str, default_no: bool = True) -> bool:
    suffix = " [y/N] " if default_no else " [Y/n] "
    answer = input(question + suffix).strip().lower()
    if not answer:
        return not default_no
    return answer in {"y", "yes"}


def cmd_pull() -> None:
    config = get_config()
    ensure_dir(SCHEMA_DIR)

    print("Fetching live schema snapshot from Directus...")
    live = fetch_snapshot(config)
    write_json(LIVE_TMP_FILE, live)

    remote_latest = read_json(REMOTE_FILE)
    local_working = read_json(LOCAL_FILE)

    if remote_latest:
        try:
            remote_vs_live = fetch_schema_diff(config, remote_latest)
            print_summary("Server compared to cached remote-latest.json", remote_vs_live)
            if not has_changes(remote_vs_live):
                print("Cached remote-latest.json already matches the server.")
        except Exception as exc:
            print(f"Warning: could not compare cached remote snapshot: {exc}")
    else:
        print("No cached remote-latest.json found yet.")

    write_json(REMOTE_FILE, live)
    print(f"Saved live server snapshot to {REMOTE_FILE}")

    if not local_working:
        write_json(LOCAL_FILE, live)
        print(f"Created initial editable working copy at {LOCAL_FILE}")
        return

    try:
        live_vs_local = fetch_schema_diff(config, local_working)
        print_summary("Server compared to local-working.json", live_vs_local)
    except Exception as exc:
        print(f"Warning: could not compare local working copy: {exc}")

    overwrite = confirm("Do you want to overwrite local-working.json with the latest server snapshot?")
    if overwrite:
        write_json(LOCAL_FILE, live)
        print(f"Updated {LOCAL_FILE}")
    else:
        print("Kept local-working.json unchanged.")


def cmd_status() -> None:
    config = get_config()
    local_working = read_json(LOCAL_FILE)
    remote_latest = read_json(REMOTE_FILE)

    if not local_working:
        raise FileNotFoundError(f"Missing {LOCAL_FILE}. Run pull first.")

    if not remote_latest:
        print("No cached remote-latest.json found. Run pull first for a proper local baseline.")

    live = fetch_snapshot(config)
    write_json(LIVE_TMP_FILE, live)

    live_vs_local = fetch_schema_diff(config, local_working)
    print_summary("Server compared to local-working.json", live_vs_local)
    print_diff_preview(live_vs_local)

    if remote_latest:
        try:
            live_vs_cached = fetch_schema_diff(config, remote_latest)
            print_summary("Server compared to remote-latest.json", live_vs_cached)
        except Exception as exc:
            print(f"Warning: could not compare remote-latest.json: {exc}")


def cmd_push() -> None:
    config = get_config()
    local_working = read_json(LOCAL_FILE)

    if not local_working:
        raise FileNotFoundError(f"Missing {LOCAL_FILE}. Run pull first.")

    print("Fetching current live schema...")
    live = fetch_snapshot(config)
    write_json(LIVE_TMP_FILE, live)

    print("Computing diff between live server and local-working.json...")
    diff_payload = fetch_schema_diff(config, local_working)
    print_summary("Changes that would be applied", diff_payload)
    print_diff_preview(diff_payload)

    if not has_changes(diff_payload):
        print("\nNo schema changes to apply.")
        return

    confirmed = confirm("Apply these schema changes to Directus?")
    if not confirmed:
        print("Cancelled.")
        return

    print("Applying schema diff...")
    apply_schema_diff(config, diff_payload)
    print("Schema applied successfully.")

    refresh = confirm("Refresh remote-latest.json and local-working.json from the server now?")
    if refresh:
        refreshed = fetch_snapshot(config)
        write_json(REMOTE_FILE, refreshed)
        write_json(LOCAL_FILE, refreshed)
        print("Both baseline files were refreshed from the live server.")
    else:
        print("Baseline files left unchanged.")


def print_help() -> None:
    print(
        """Usage:
  python3 scripts/directus_schema_sync.py pull
  python3 scripts/directus_schema_sync.py status
  python3 scripts/directus_schema_sync.py push
"""
    )


def main() -> None:
    if len(sys.argv) < 2 or sys.argv[1] in {"-h", "--help", "help"}:
        print_help()
        return

    cmd = sys.argv[1]
    if cmd == "pull":
        cmd_pull()
    elif cmd == "status":
        cmd_status()
    elif cmd == "push":
        cmd_push()
    else:
        raise ValueError(f"Unknown command: {cmd}")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nCancelled by user.")
        sys.exit(1)
    except Exception as exc:
        print(f"\nError:\n{exc}")
        sys.exit(1)
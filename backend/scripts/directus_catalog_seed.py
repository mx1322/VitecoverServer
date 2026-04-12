#!/usr/bin/env python3
import json
import os
import sys
from pathlib import Path
from typing import Any, Dict, List

import requests


ROOT = Path(__file__).resolve().parents[1]
ENV_PATH = ROOT / ".env"
FALLBACK_ENV_PATH = ROOT.parent / ".env"
DEFAULT_SEED_PATH = ROOT / "directus" / "seed" / "product-catalog.json"


def parse_env_file(path: Path) -> Dict[str, str]:
    if not path.exists():
        raise FileNotFoundError(f"Missing .env file: {path}")

    env: Dict[str, str] = {}
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        env[key.strip()] = value.strip().strip('"').strip("'")
    return env


def get_config() -> Dict[str, str]:
    env_path = ENV_PATH if ENV_PATH.exists() else FALLBACK_ENV_PATH
    file_env = parse_env_file(env_path)

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

    admin_email = (
        os.getenv("DIRECTUS_ADMIN_EMAIL")
        or os.getenv("ADMIN_EMAIL")
        or file_env.get("DIRECTUS_ADMIN_EMAIL")
        or file_env.get("ADMIN_EMAIL")
    )

    admin_password = (
        os.getenv("DIRECTUS_ADMIN_PASSWORD")
        or os.getenv("ADMIN_PASSWORD")
        or file_env.get("DIRECTUS_ADMIN_PASSWORD")
        or file_env.get("ADMIN_PASSWORD")
    )

    if not token and not (admin_email and admin_password):
        raise ValueError("Missing token or admin login credentials in .env")

    return {
        "DIRECTUS_URL": directus_url,
        "TOKEN": token,
        "ADMIN_EMAIL": admin_email,
        "ADMIN_PASSWORD": admin_password,
    }


def login_for_token(config: Dict[str, str]) -> str:
    if not config.get("ADMIN_EMAIL") or not config.get("ADMIN_PASSWORD"):
        raise ValueError("Missing DIRECTUS_ADMIN_EMAIL / DIRECTUS_ADMIN_PASSWORD")

    response = requests.post(
        f"{config['DIRECTUS_URL']}/auth/login",
        headers={"Content-Type": "application/json"},
        data=json.dumps(
            {
                "email": config["ADMIN_EMAIL"],
                "password": config["ADMIN_PASSWORD"],
            }
        ),
        timeout=60,
    )

    payload = response.json()
    if not response.ok:
        raise RuntimeError(
            f"HTTP {response.status_code} {response.reason}\n{json.dumps(payload, indent=2, ensure_ascii=False)}"
        )

    token = payload.get("data", {}).get("access_token")
    if not token:
        raise RuntimeError("Login succeeded but no access token was returned.")

    return token


def api_request(
    config: Dict[str, str],
    method: str,
    endpoint: str,
    payload: Any = None,
    params: Dict[str, Any] | None = None,
) -> Any:
    url = f"{config['DIRECTUS_URL']}{endpoint}"
    token = config.get("TOKEN") or login_for_token(config)
    headers = {
        "Authorization": f"Bearer {token}",
    }

    kwargs: Dict[str, Any] = {
        "headers": headers,
        "params": params,
        "timeout": 60,
    }

    if payload is not None:
        headers["Content-Type"] = "application/json"
        kwargs["data"] = json.dumps(payload)

    response = requests.request(method=method, url=url, **kwargs)

    if response.status_code in {401, 403} and config.get("ADMIN_EMAIL") and config.get("ADMIN_PASSWORD"):
        token = login_for_token(config)
        config["TOKEN"] = token
        headers["Authorization"] = f"Bearer {token}"
        response = requests.request(method=method, url=url, **kwargs)

    try:
        data = response.json()
    except Exception:
        data = response.text

    if not response.ok:
        detail = json.dumps(data, indent=2, ensure_ascii=False) if not isinstance(data, str) else data
        raise RuntimeError(f"HTTP {response.status_code} {response.reason}\n{detail}")

    return data


def load_seed(path: Path) -> Dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def fetch_one_by_code(config: Dict[str, str], collection: str, code: str) -> Dict[str, Any] | None:
    payload = api_request(
        config,
        "GET",
        f"/items/{collection}",
        params={
            "filter[code][_eq]": code,
            "limit": 1,
        },
    )
    items = payload.get("data", [])
    return items[0] if items else None


def upsert_code_item(config: Dict[str, str], collection: str, item: Dict[str, Any]) -> Dict[str, Any]:
    existing = fetch_one_by_code(config, collection, item["code"])

    if existing:
        payload = api_request(
            config,
            "PATCH",
            f"/items/{collection}/{existing['id']}",
            payload=item,
        )
        print(f"Updated {collection}: {item['code']}")
        return payload["data"]

    payload = api_request(config, "POST", f"/items/{collection}", payload=item)
    print(f"Created {collection}: {item['code']}")
    return payload["data"]


def fetch_pricing_rule(
    config: Dict[str, str],
    item: Dict[str, Any],
    product_id: int,
    geo_zone_id: int,
) -> Dict[str, Any] | None:
    payload = api_request(
        config,
        "GET",
        "/items/pricing_rules",
        params={
            "fields": "id",
            "filter[product][_eq]": product_id,
            "filter[geo_zone][_eq]": geo_zone_id,
            "filter[customer_type][_eq]": item["customer_type"],
            "filter[vehicle_category][_eq]": item["vehicle_category"],
            "filter[usage_type][_eq]": item["usage_type"],
            "filter[duration_days][_eq]": item["duration_days"],
            "filter[min_fiscal_power][_eq]": item["min_fiscal_power"],
            "filter[max_fiscal_power][_eq]": item["max_fiscal_power"],
            "limit": 1,
        },
    )
    items = payload.get("data", [])
    return items[0] if items else None


def upsert_pricing_rule(
    config: Dict[str, str],
    item: Dict[str, Any],
    product_id: int,
    geo_zone_id: int,
) -> None:
    payload_item = {
        "product": product_id,
        "geo_zone": geo_zone_id,
        "customer_type": item["customer_type"],
        "vehicle_category": item["vehicle_category"],
        "usage_type": item["usage_type"],
        "duration_days": item["duration_days"],
        "min_fiscal_power": item["min_fiscal_power"],
        "max_fiscal_power": item["max_fiscal_power"],
        "base_premium": item["base_premium"],
        "tax_rate": item.get("tax_rate"),
        "requires_manual_quote": item.get("requires_manual_quote", False),
        "priority": item.get("priority", 10),
        "is_active": item.get("is_active", True),
        "notes": item.get("notes"),
    }

    existing = fetch_pricing_rule(config, item, product_id, geo_zone_id)
    if existing:
        api_request(
            config,
            "PATCH",
            f"/items/pricing_rules/{existing['id']}",
            payload=payload_item,
        )
        print(
            "Updated pricing rule:"
            f" {item['product_code']} {item['duration_days']}d {item['min_fiscal_power']}-{item['max_fiscal_power']} CV"
        )
        return

    api_request(config, "POST", "/items/pricing_rules", payload=payload_item)
    print(
        "Created pricing rule:"
        f" {item['product_code']} {item['duration_days']}d {item['min_fiscal_power']}-{item['max_fiscal_power']} CV"
    )


def seed_catalog(seed_path: Path) -> None:
    config = get_config()
    data = load_seed(seed_path)

    geo_zone_ids: Dict[str, int] = {}
    for geo_zone in data.get("geo_zones", []):
        stored = upsert_code_item(config, "geo_zones", geo_zone)
        geo_zone_ids[geo_zone["code"]] = stored["id"]

    product_ids: Dict[str, int] = {}
    for product in data.get("products", []):
        stored = upsert_code_item(config, "insurance_products", product)
        product_ids[product["code"]] = stored["id"]

    for rule in data.get("pricing_rules", []):
        product_id = product_ids[rule["product_code"]]
        geo_zone_id = geo_zone_ids[rule["geo_zone_code"]]
        upsert_pricing_rule(config, rule, product_id, geo_zone_id)

    print("\nCatalog seed completed.")


def print_usage() -> None:
    print("Usage:")
    print("  python3 scripts/directus_catalog_seed.py seed")
    print("  python3 scripts/directus_catalog_seed.py seed path/to/catalog.json")


def main(argv: List[str]) -> int:
    if len(argv) < 2 or argv[1] not in {"seed"}:
        print_usage()
        return 1

    seed_path = Path(argv[2]).resolve() if len(argv) > 2 else DEFAULT_SEED_PATH
    if not seed_path.exists():
        print(f"Missing seed file: {seed_path}")
        return 1

    seed_catalog(seed_path)
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))

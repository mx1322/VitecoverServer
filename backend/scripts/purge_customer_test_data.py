#!/usr/bin/env python3
import argparse
import json
import os
import sys
from pathlib import Path
from typing import Any, Dict, Iterable, List

import requests


ROOT = Path(__file__).resolve().parents[1]
ENV_PATH = ROOT / ".env"
FALLBACK_ENV_PATH = ROOT.parent / ".env"


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
        "TOKEN": token or "",
        "ADMIN_EMAIL": admin_email or "",
        "ADMIN_PASSWORD": admin_password or "",
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


def fetch_items(
    config: Dict[str, str],
    collection: str,
    params: Dict[str, Any],
) -> List[Dict[str, Any]]:
    payload = api_request(config, "GET", f"/items/{collection}", params=params)
    return payload.get("data", [])


def delete_item(config: Dict[str, str], collection: str, item_id: int | str) -> None:
    endpoint = f"/files/{item_id}" if collection == "directus_files" else f"/items/{collection}/{item_id}"
    api_request(config, "DELETE", endpoint)


def chunked(values: List[Any], size: int = 50) -> Iterable[List[Any]]:
    for index in range(0, len(values), size):
        yield values[index : index + size]


def filter_in(field: str, values: List[Any]) -> Dict[str, str]:
    return {f"filter[{field}][_in]": ",".join(str(value) for value in values)}


def fetch_customer_by_email(config: Dict[str, str], email: str) -> Dict[str, Any] | None:
    items = fetch_items(
        config,
        "customers",
        {
            "fields": "id,email,first_name,last_name,directus_user",
            "filter[email][_eq]": email.strip().lower(),
            "limit": 1,
        },
    )
    return items[0] if items else None


def collect_dependencies(config: Dict[str, str], customer: Dict[str, Any]) -> Dict[str, List[Dict[str, Any]]]:
    customer_id = customer["id"]
    quotes = fetch_items(
        config,
        "quotes",
        {
            "fields": "id,quote_number,vehicle,driver",
            "filter[customer][_eq]": customer_id,
            "limit": 200,
            "sort": "-id",
        },
    )
    orders = fetch_items(
        config,
        "orders",
        {
            "fields": "id,order_number,quote,vehicle,driver",
            "filter[customer][_eq]": customer_id,
            "limit": 200,
            "sort": "-id",
        },
    )
    vehicles = fetch_items(
        config,
        "vehicles",
        {
            "fields": "id,registration_number",
            "filter[customer][_eq]": customer_id,
            "limit": 200,
            "sort": "-id",
        },
    )
    drivers = fetch_items(
        config,
        "drivers",
        {
            "fields": "id,first_name,last_name",
            "filter[customer][_eq]": customer_id,
            "limit": 200,
            "sort": "-id",
        },
    )
    policies = fetch_items(
        config,
        "policies",
        {
            "fields": "id,policy_number,order,pdf_file",
            "filter[customer][_eq]": customer_id,
            "limit": 200,
            "sort": "-id",
        },
    )

    order_ids = [item["id"] for item in orders]
    policy_ids = [item["id"] for item in policies]
    payments: List[Dict[str, Any]] = []
    refunds: List[Dict[str, Any]] = []
    admin_reviews: List[Dict[str, Any]] = []

    for batch in chunked(order_ids):
        payments.extend(
            fetch_items(
                config,
                "payments",
                {
                    "fields": "id,order",
                    **filter_in("order", batch),
                    "limit": 200,
                },
            )
        )
        admin_reviews.extend(
            fetch_items(
                config,
                "admin_reviews",
                {
                    "fields": "id,order,policy,review_type,status",
                    **filter_in("order", batch),
                    "limit": 200,
                },
            )
        )

    for batch in chunked(policy_ids):
        admin_reviews.extend(
            fetch_items(
                config,
                "admin_reviews",
                {
                    "fields": "id,order,policy,review_type,status",
                    **filter_in("policy", batch),
                    "limit": 200,
                },
            )
        )

    payments = list({item["id"]: item for item in payments}.values())
    admin_reviews = list({item["id"]: item for item in admin_reviews}.values())
    payment_ids = [item["id"] for item in payments]

    refunds.extend(
        fetch_items(
            config,
            "refunds",
            {
                "fields": "id,order,payment,policy,customer",
                "filter[customer][_eq]": customer_id,
                "limit": 200,
                "sort": "-id",
            },
        )
    )
    for batch in chunked(order_ids):
        refunds.extend(
            fetch_items(
                config,
                "refunds",
                {
                    "fields": "id,order,payment,policy,customer",
                    **filter_in("order", batch),
                    "limit": 200,
                },
            )
        )
    for batch in chunked(policy_ids):
        refunds.extend(
            fetch_items(
                config,
                "refunds",
                {
                    "fields": "id,order,payment,policy,customer",
                    **filter_in("policy", batch),
                    "limit": 200,
                },
            )
        )
    for batch in chunked(payment_ids):
        refunds.extend(
            fetch_items(
                config,
                "refunds",
                {
                    "fields": "id,order,payment,policy,customer",
                    **filter_in("payment", batch),
                    "limit": 200,
                },
            )
        )
    refunds = list({item["id"]: item for item in refunds}.values())

    pdf_file_ids = [item.get("pdf_file") for item in policies if item.get("pdf_file")]
    files = [{"id": file_id} for file_id in pdf_file_ids]

    return {
        "customer": [customer],
        "refunds": refunds,
        "admin_reviews": admin_reviews,
        "payments": payments,
        "policies": policies,
        "files": files,
        "orders": orders,
        "quotes": quotes,
        "vehicles": vehicles,
        "drivers": drivers,
    }


def print_summary(dependencies: Dict[str, List[Dict[str, Any]]]) -> None:
    print("Delete order:")
    for name in ["refunds", "admin_reviews", "payments", "policies", "files", "orders", "quotes", "vehicles", "drivers", "customer"]:
        items = dependencies.get(name, [])
        sample = ", ".join(str(item.get("id")) for item in items[:8])
        suffix = f" [{sample}]" if sample else ""
        print(f"  {name}: {len(items)}{suffix}")


def purge_dependencies(
    config: Dict[str, str],
    dependencies: Dict[str, List[Dict[str, Any]]],
    delete_customer: bool,
) -> None:
    for name in ["refunds", "admin_reviews", "payments", "policies", "files", "orders", "quotes", "vehicles", "drivers"]:
        for item in dependencies.get(name, []):
            delete_item(config, "directus_files" if name == "files" else name, item["id"])
            print(f"deleted {name}:{item['id']}")

    if delete_customer:
        customer = dependencies["customer"][0]
        delete_item(config, "customers", customer["id"])
        print(f"deleted customer:{customer['id']}")


def main() -> int:
    parser = argparse.ArgumentParser(description="Preview or purge Directus test data for one customer.")
    parser.add_argument("--email", required=True, help="Customer email to purge.")
    parser.add_argument("--apply", action="store_true", help="Actually delete the records.")
    parser.add_argument("--delete-customer", action="store_true", help="Also delete the customer row after dependents are gone.")
    args = parser.parse_args()

    config = get_config()
    customer = fetch_customer_by_email(config, args.email)
    if not customer:
        print(f"Customer not found: {args.email}")
        return 1

    dependencies = collect_dependencies(config, customer)
    print_summary(dependencies)

    if not args.apply:
        print("Dry run only. Re-run with --apply to delete.")
        return 0

    purge_dependencies(config, dependencies, delete_customer=args.delete_customer)
    print("Done.")
    return 0


if __name__ == "__main__":
    sys.exit(main())

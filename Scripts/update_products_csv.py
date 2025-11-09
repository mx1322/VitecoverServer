import requests
import csv
import os
from math import ceil

# --- 配置信息 ---
BASE_URL = "http://vitecover.com/graphql/"
EMAIL = "admin@vitecover.com"
PASSWORD = "13221322"

MAIN_FILE = "products.csv"
TEMP_FILE = "products_temp.csv"

# 运营/上架的渠道（名称或 slug）；用于为“无 channel listing 的变种”生成占位行
REQUIRED_CHANNELS = ["test-Inssurance"]  # <- 请与 Saleor 中的渠道名称/slug 对齐


# -------------------- 基础与通用 --------------------
def graphql_request(query, variables=None, token=None):
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"JWT {token}"
    resp = requests.post(BASE_URL, json={"query": query, "variables": variables or {}}, headers=headers)
    try:
        js = resp.json()
        if "errors" in js and resp.status_code >= 400:
            print(f"DEBUG: GraphQL HTTP {resp.status_code} errors: {js['errors']}")
        return js
    except Exception:
        print(f"❌ 非 JSON 响应 (HTTP {resp.status_code}): {resp.text}")
        return {"errors": [{"message": f"HTTP {resp.status_code}: {resp.text}"}]}


def get_token():
    q = """
    mutation($email: String!, $password: String!) {
      tokenCreate(email: $email, password: $password) {
        token
        errors { field message }
      }
    }
    """
    r = requests.post(BASE_URL, json={"query": q, "variables": {"email": EMAIL, "password": PASSWORD}})
    r.raise_for_status()
    data = r.json()
    errs = data.get("data", {}).get("tokenCreate", {}).get("errors") or []
    if errs:
        raise Exception(f"登录失败: {errs}")
    return data["data"]["tokenCreate"]["token"]


# -------------------- 全量产品/变种抓取（含分页） --------------------
def fetch_all_products(token, page_size=100):
    """
    从 Saleor 抓取全量产品（分页），返回 edges 列表。
    结构包含：id, slug, name, variants{id, name, sku, channelListings{channel{id name slug} price{amount currency}}}
    """
    query = """
    query($first:Int!, $after:String){
      products(first:$first, after:$after){
        edges{
          node{
            id
            slug
            name
            variants{
              id
              name
              sku
              channelListings{
                channel{ id name slug }
                price{ amount currency }
              }
            }
          }
          cursor
        }
        pageInfo{ hasNextPage endCursor }
      }
    }
    """
    edges = []
    after = None
    while True:
        data = graphql_request(query, {"first": page_size, "after": after}, token)
        prods = (data.get("data", {}) or {}).get("products", {})
        batch = prods.get("edges") or []
        edges.extend(batch)
        pi = prods.get("pageInfo") or {}
        if not pi.get("hasNextPage"):
            break
        after = pi.get("endCursor")
    return edges


# -------------------- 本地 CSV 工具 --------------------
def load_csv(file):
    if not os.path.exists(file):
        return []
    with open(file, newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def lowercase_csv_product_slugs(file_path):
    rows = load_csv(file_path)
    if not rows:
        return
    fieldnames = rows[0].keys()
    changed = False
    for r in rows:
        if r.get("product_slug"):
            new_slug = r["product_slug"].lower()
            if new_slug != r["product_slug"]:
                r["product_slug"] = new_slug
                changed = True
    if changed:
        with open(file_path, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(rows)
        print("✅ 已将本地 CSV 的 product_slug 统一为小写")


# -------------------- 导出（写 CSV） --------------------
def export_all_products(token, csv_file, include_ids=True):
    """
    导出远端全量产品到 CSV。
    - 若某变种没有 channel listing，则为 REQUIRED_CHANNELS 生成占位行（price=0）。
    - 始终写入后端返回的小写 slug。
    """
    edges = fetch_all_products(token, page_size=100)

    with open(csv_file, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        if include_ids:
            writer.writerow(["product_slug", "product_id", "variant_id",
                             "sku", "name", "channel_name", "channel_id", "price"])
        else:
            writer.writerow(["product_slug", "sku", "name", "channel_name", "price"])

        for e in edges:
            n = e["node"]
            slug = (n["slug"] or "").lower()
            variants = n.get("variants") or []

            # 无变种：对每个 REQUIRED_CHANNELS 写占位
            if not variants:
                for ch in REQUIRED_CHANNELS:
                    row = [slug, n["id"], "", "", n["name"], ch, "", 0]
                    if include_ids:
                        writer.writerow(row)
                    else:
                        writer.writerow([row[0], row[3], row[4], row[5], row[7]])
                continue

            for v in variants:
                listings = v.get("channelListings") or []
                if listings:
                    for cl in listings:
                        channel = cl.get("channel") or {}
                        amount = (cl.get("price") or {}).get("amount") or 0
                        try:
                            price_int = int(round(float(amount)))
                        except Exception:
                            price_int = 0
                        row = [
                            slug, n["id"], v["id"],
                            v.get("sku") or "", v.get("name") or "",
                            channel.get("name") or channel.get("slug") or "",
                            channel.get("id") or "", price_int
                        ]
                        if include_ids:
                            writer.writerow(row)
                        else:
                            writer.writerow([row[0], row[3], row[4], row[5], row[7]])
                else:
                    # 没有任何 channel listing：按 REQUIRED_CHANNELS 占位
                    for ch in REQUIRED_CHANNELS:
                        row = [slug, n["id"], v["id"], v.get("sku") or "", v.get("name") or "", ch, "", 0]
                        if include_ids:
                            writer.writerow(row)
                        else:
                            writer.writerow([row[0], row[3], row[4], row[5], row[7]])

    print(f"✅ Exported ALL products to {csv_file}")


# -------------------- 变种/产品 ID 辅助 --------------------
PRODUCT_VARIANTS_CACHE = {}  # slug(lower) -> { sku|DEFAULT_VARIANT: variant_id }
PRODUCT_IN_CHANNEL_CACHE = set()  # (product_id, channel_id)


def build_variants_cache_from_edges(edges):
    """
    用全量 products edges 建立变种缓存，便于后续通过 (slug, sku) 找到 variant_id
    """
    PRODUCT_VARIANTS_CACHE.clear()
    for e in edges:
        n = e["node"]
        slug = (n["slug"] or "").lower()
        if slug not in PRODUCT_VARIANTS_CACHE:
            PRODUCT_VARIANTS_CACHE[slug] = {}
        for v in n.get("variants") or []:
            sku = v.get("sku") or "DEFAULT_VARIANT"
            PRODUCT_VARIANTS_CACHE[slug][sku] = v["id"]
    print(f"✅ 变种缓存构建完成：{len(PRODUCT_VARIANTS_CACHE)} 个产品")


def get_variant_id_from_cache(slug, sku=None):
    d = PRODUCT_VARIANTS_CACHE.get((slug or "").lower()) or {}
    if sku and sku in d:
        return d[sku]
    if not sku and "DEFAULT_VARIANT" in d:
        return d["DEFAULT_VARIANT"]
    return None


def get_product_id_by_slug(token, slug):
    q = """query($slug:String!){ product(slug:$slug){ id slug } }"""
    # 优先原值，再小写
    for s in [slug, (slug or "").lower()]:
        if not s:
            continue
        res = graphql_request(q, {"slug": s}, token)
        prod = (res.get("data", {}) or {}).get("product")
        if prod:
            return prod["id"]
    return None


def get_channel_id_by_name(token, channel_name):
    if not channel_name:
        return None
    q = """query { channels { id name slug } }"""
    data = graphql_request(q, {}, token)
    for ch in (data.get("data", {}) or {}).get("channels", []):
        if ch["name"] == channel_name or ch["slug"] == channel_name:
            return ch["id"]
    return None


def check_channel_exists(token, channel_id):
    if not channel_id:
        return False
    q = """query($id: ID!){ channel(id:$id){ id } }"""
    data = graphql_request(q, {"id": channel_id}, token)
    return data.get("data", {}).get("channel") is not None


# -------------------- 创建变种 / 父产品上架 / 改价 --------------------
def create_product_variant(token, product_id, sku, name=None):
    """在指定的 Product 下创建新的 ProductVariant（无属性）"""
    print(f"🔄 创建变种: product={product_id} sku={sku}")

    # 关键修复：去掉未使用的 $attributes 变量
    q = """
    mutation($productId: ID!, $sku: String!, $name: String) {
      productVariantCreate(input: {
        product: $productId
        sku: $sku
        name: $name
        attributes: []   # 无变种属性时传空列表
      }) {
        productVariant { id sku }
        errors { field message code }
      }
    }
    """

    variables = {
        "productId": product_id,
        "sku": sku,
        "name": name or sku,
    }

    res = graphql_request(q, variables, token)

    if "errors" in res and res.get("data") is None:
        print(f"❌ 变种创建失败(GraphQL)：{res['errors']}")
        return None

    data = (res.get("data", {}) or {}).get("productVariantCreate", {})
    errs = data.get("errors") or []
    pv = data.get("productVariant")

    if errs:
        print(f"❌ 变种创建失败(API)：{errs}")
        return None

    if pv and pv.get("id"):
        print(f"✅ 新建变种成功 id={pv['id']}")
        return pv["id"]

    print(f"❌ 变种创建返回异常：{res}")
    return None

def ensure_product_in_channel(token, product_id, channel_id, sku_for_log=""):
    global PRODUCT_IN_CHANNEL_CACHE
    key = (product_id, channel_id)
    if key in PRODUCT_IN_CHANNEL_CACHE:
        return True

    print(f"DEBUG: 确保父产品 {product_id} (SKU:{sku_for_log}) 在渠道 {channel_id}")
    q = """
    mutation($productId: ID!, $input: ProductChannelListingUpdateInput!) {
      productChannelListingUpdate(id: $productId, input: $input) {
        product { id }
        errors { field message code }
      }
    }
    """
    res = graphql_request(q, {"productId": product_id, "input": {"updateChannels": [{"channelId": channel_id, "isPublished": True}]}}, token)
    if "errors" in res and res.get("data") is None:
        print(f"⚠️ 父产品上架失败(GraphQL)：{res['errors']}")
        return False

    data = res.get("data", {}).get("productChannelListingUpdate", {})
    errs = data.get("errors") or []
    if errs:
        ignorable = ["already", "exists", "duplicate"]
        if all(any(k in (e.get("message", "").lower()) for k in ignorable) for e in errs):
            print("ℹ️ 父产品已在渠道（忽略重复）")
            PRODUCT_IN_CHANNEL_CACHE.add(key)
            return True
        print(f"⚠️ 父产品上架失败(API)：{errs}")
        return False

    PRODUCT_IN_CHANNEL_CACHE.add(key)
    print("✅ 父产品上架完成")
    return True


def update_channel_price(token, variant_id, product_id, channel_id, channel_name, price, sku=None):
    if not variant_id:
        print(f"❌ 缺少 variant_id，无法改价（SKU={sku} channel={channel_name}）")
        return
    if not channel_id:
        channel_id = get_channel_id_by_name(token, channel_name)

    print(f"DEBUG: 改价 SKU={sku}, channel={channel_name}, channel_id={channel_id}")
    if not channel_id or not check_channel_exists(token, channel_id):
        print(f"❌ 渠道不存在：{channel_name}")
        return

    try:
        p = float(price)
        p_str = f"{p:.2f}"
    except ValueError:
        print(f"⚠️ 跳过，价格非法：{price}")
        return
    if float(p_str) <= 0:
        print(f"⚠️ 跳过，价格必须>0：{price}")
        return

    q = """
    mutation($id: ID!, $input: [ProductVariantChannelListingAddInput!]!) {
      productVariantChannelListingUpdate(id:$id, input:$input){
        errors { field message }
      }
    }
    """
    res = graphql_request(q, {"id": variant_id, "input": [{"channelId": channel_id, "price": p_str}]}, token)
    if "errors" in res and res.get("data") is None:
        print(f"⚠️ 改价失败(GraphQL)：{res['errors']}")
        return
    errs = (res.get("data", {}).get("productVariantChannelListingUpdate", {}) or {}).get("errors") or []
    if errs:
        print(f"⚠️ 改价失败(API)：{errs}")
        return
    print(f"💶 改价成功 variant={variant_id} channel={channel_name} price={p_str}")


# -------------------- 对比 --------------------
def compare_files(local, remote):
    """
    键：(sku or 小写 product_slug, channel_name)
    跳过 channel_name 为空。
    """
    def key_of(row):
        if not row.get("channel_name"):
            return None
        slug = (row.get("product_slug") or "").lower()
        k = row.get("sku") or slug
        return (k, row["channel_name"])

    lmap = {key_of(r): r for r in local if key_of(r) is not None}
    rmap = {key_of(r): r for r in remote if key_of(r) is not None}

    new_items = []
    for k, r in lmap.items():
        if k not in rmap:
            new_items.append(r.copy())

    deleted_items = [r for k, r in rmap.items() if k not in lmap]

    updated_items = []
    for k, r in lmap.items():
        if k in rmap:
            def to_int(x):
                try:
                    return int(float(x or 0))
                except Exception:
                    return 0
            lp, rp = to_int(r.get("price")), to_int(rmap[k].get("price"))
            if lp != rp:
                updated_items.append((k, {
                    **r,
                    "variant_id": rmap[k].get("variant_id"),
                    "channel_id": rmap[k].get("channel_id"),
                    "product_id": rmap[k].get("product_id")
                }, [("price", rp, lp)]))
    return new_items, deleted_items, updated_items


# -------------------- 主流程 --------------------
if __name__ == "__main__":
    try:
        token = get_token()
    except Exception as e:
        print(f"❌ 获取 token 失败：{e}")
        exit(1)

    # 建立全量变种缓存（用于后续从 slug/sku 找 variant_id）
    all_edges = fetch_all_products(token, page_size=100)
    build_variants_cache_from_edges(all_edges)

    # 若本地没有 CSV：直接导出全量（不含 ID，便于编辑价格）
    if not os.path.exists(MAIN_FILE):
        print("📦 未发现本地 products.csv，正在从远端导出全量产品...")
        export_all_products(token, MAIN_FILE, include_ids=False)
        lowercase_csv_product_slugs(MAIN_FILE)
        print("✅ 初始化完成。请编辑 products.csv 的价格后再次运行并选择 2 同步。")
        exit(0)

    # 每次对比前，抓取远端最新状态（含 ID）
    export_all_products(token, TEMP_FILE, include_ids=True)
    remote = load_csv(TEMP_FILE)
    local = load_csv(MAIN_FILE)

    new_items, deleted_items, updated_items = compare_files(local, remote)

    if not new_items and not deleted_items and not updated_items:
        print("✅ 本地与远端一致")
        if os.path.exists(TEMP_FILE):
            os.remove(TEMP_FILE)
        exit(0)

    print("\n差异清单：")
    if new_items:
        print("➕ 需要上架到指定 channel：")
        for r in new_items:
            print(f"- {r.get('sku') or r['product_slug']} ({r.get('name','')}) channel={r['channel_name']} price={r['price']}")
    if updated_items:
        print("✏️ 仅需改价：")
        for (k, r, diffs) in updated_items:
            for d in diffs:
                print(f"- {r.get('sku') or r['product_slug']} channel={r['channel_name']} price: {d[1]} → {d[2]} (id={r.get('variant_id','?')})")
    if deleted_items:
        print("➖ 远端存在但本地没有（仅提示，不自动删除）：")
        for r in deleted_items:
            print(f"- {r.get('sku') or r['product_slug']} ({r.get('name','')}) channel={r['channel_name']} id={r.get('variant_id','?')}")

    choice = input("\n请选择操作: 1=仅更新本地文件, 2=上架/改价到远端 : ")
    if choice.strip() == "1":
        export_all_products(token, MAIN_FILE, include_ids=False)
        lowercase_csv_product_slugs(MAIN_FILE)
        print("✅ 已更新本地文件")
    elif choice.strip() == "2":
        confirm = input("\n确认对远端执行以上所有\"上架/改价\"操作? (y/n): ")
        if confirm.lower().strip() != "y":
            print("❌ 操作取消")
            exit(0)

        # 准备要处理的项
        items_to_process = new_items + [r for _, r, _ in updated_items]

        # 尝试补全缺失 IDs & 预创建缺失变种
        variants_to_create = []
        for r in items_to_process:
            slug = (r.get("product_slug") or "").lower()
            sku = r.get("sku") or None

            product_id = r.get("product_id") or get_product_id_by_slug(token, slug)
            r["product_id"] = product_id

            variant_id = r.get("variant_id") or get_variant_id_from_cache(slug, sku)
            if not variant_id and sku and product_id:
                variants_to_create.append({"product_id": product_id, "slug": slug, "sku": sku, "name": r.get("name")})
            r["variant_id"] = variant_id

        if variants_to_create:
            print(f"--- ⚠️ 发现 {len(variants_to_create)} 个缺失变种，准备创建 ---")
            for v in variants_to_create:
                new_id = create_product_variant(token, v["product_id"], v["sku"], v.get("name"))
                if new_id:
                    PRODUCT_VARIANTS_CACHE.setdefault(v["slug"], {})[v["sku"]] = new_id
                    # 回填
                    for r in items_to_process:
                        if (r.get("sku") == v["sku"]) and ((r.get("product_slug") or "").lower() == v["slug"]):
                            r["variant_id"] = new_id

        print("\n--- 💰 开始执行上架和价格更新 ---")
        for r in items_to_process:
            slug = (r.get("product_slug") or "").lower()
            sku = r.get("sku") or None
            product_id = r.get("product_id")
            variant_id = r.get("variant_id")
            channel_name = r.get("channel_name")
            channel_id = r.get("channel_id")

            if not product_id or not variant_id:
                print(f"❌ 跳过: slug={slug}, sku={sku} 缺少 product_id 或 variant_id")
                continue

            # 1) 确保父产品在渠道
            if not channel_id:
                channel_id = get_channel_id_by_name(token, channel_name)
                r["channel_id"] = channel_id
            if not channel_id:
                print(f"❌ 跳过: 找不到渠道 {channel_name}")
                continue

            if not ensure_product_in_channel(token, product_id, channel_id, sku_for_log=sku or slug):
                print(f"❌ 跳过: 父产品无法上架到渠道 {channel_name}")
                continue

            # 2) 改价/上架变种
            update_channel_price(token, variant_id, product_id, channel_id, channel_name, r.get("price"), sku)

        # 导出最新远端 -> 覆盖本地
        export_all_products(token, MAIN_FILE, include_ids=False)
        lowercase_csv_product_slugs(MAIN_FILE)
        print("✅ 已上架/改价并覆盖导出到 products.csv")
    else:
        print("❌ 操作取消")

    if os.path.exists(TEMP_FILE):
        os.remove(TEMP_FILE)

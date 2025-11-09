#!/usr/bin/env bash
set -euo pipefail

# === 配置区 ===
EMAIL="${1:-admin@vitecover.com}"
PASS="${2:-13221322}"
GOOGLE_CLIENT_ID="${GOOGLE_CLIENT_ID:-your-google-client-id.apps.googleusercontent.com}"
GOOGLE_CLIENT_SECRET="${GOOGLE_CLIENT_SECRET:-your-google-client-secret}"

API_URL="http://localhost/graphql/"  # ✅ 所有请求走反向代理80端口

echo "▶ Step 1: 获取管理员 JWT..."
TOKEN=$(docker compose exec -T api python3 - <<PY
import json, urllib.request
API="${API_URL}"
q='mutation($e:String!,$p:String!){tokenCreate(email:$e,password:$p){token accountErrors{message}}}'
data=json.dumps({"query":q,"variables":{"e":"${EMAIL}","p":"${PASS}"}}).encode()
req=urllib.request.Request(API,data=data,headers={"Content-Type":"application/json"})
try:
    with urllib.request.urlopen(req) as r:
        print(json.load(r)["data"]["tokenCreate"]["token"])
except Exception as e:
    print("")
PY
)

if [[ -z "$TOKEN" || "$TOKEN" == "None" ]]; then
  echo "❌ 无法获取管理员 token，请确认账号或密码正确。"
  exit 1
fi

echo "✔ 已获取管理员 token"

# === 启用 OIDC 插件 ===
echo "▶ Step 2: 配置 OpenID Connect 插件 (Google)..."
docker compose exec -T api python3 - <<PY
import os, json, urllib.request
API = "${API_URL}"
TOKEN = "$TOKEN"

query = '''
mutation(\$id:ID!, \$input: PluginUpdateInput!){
  pluginUpdate(id:\$id, input:\$input){
    errors{ field message }
    plugin{ id name globalConfiguration{ active } }
  }
}
'''

vars = {
  "id": "plugin.openid-connect",
  "input": {
    "active": True,
    "configuration": [
      {"name": "clientId", "value": "$GOOGLE_CLIENT_ID"},
      {"name": "clientSecret", "value": "$GOOGLE_CLIENT_SECRET"},
      {"name": "authorizationUrl", "value": "https://accounts.google.com/o/oauth2/v2/auth"},
      {"name": "tokenUrl", "value": "https://oauth2.googleapis.com/token"},
      {"name": "jwksUrl", "value": "https://www.googleapis.com/oauth2/v3/certs"},
      {"name": "userInfoUrl", "value": "https://openidconnect.googleapis.com/v1/userinfo"},
      {"name": "scope", "value": "openid email profile"},
      {"name": "staffUserDomains", "value": "@vitecover.com"}
    ]
  }
}

req = urllib.request.Request(
  API,
  data=json.dumps({"query": query, "variables": vars}).encode(),
  headers={"Content-Type": "application/json", "Authorization": f"JWT {TOKEN}"}
)

try:
    with urllib.request.urlopen(req) as r:
        print("✔ 插件配置结果:\n", json.dumps(json.load(r), indent=2))
except Exception as e:
    print("❌ 插件配置失败:", e)
PY

echo ""
echo "✅ 完成。"
echo "现在你可以通过以下 URL 测试 Google 登录："
echo "👉  http://localhost/account/login/?plugin=oidc"
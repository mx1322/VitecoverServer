# Vitecover 部署架构 Code Review 摘要

## 1. 当前部署架构总览

VitecoverServer 当前是一个小型 monorepo，主要目录分工如下：

- `backend/`：Directus 后端、Directus extensions、schema 同步脚本、seed 数据、后端 starter Nginx 配置。
- `frontend/`：Next.js 前端应用，同时包含一部分面向账户、订单、PDF 下载等业务 API routes。
- `compose/`：集成部署层共享资源，重点是 edge Nginx 配置。
- `deploy/`：Linux 部署说明、部署环境变量模板和部署脚本。
- `docs/`：产品、技术路线、前后端计划、备份和运维文档。

当前推荐部署方式是从仓库根目录执行：

```bash
./up.sh
```

该脚本组合使用：

```bash
docker compose --env-file deploy/linux/.env.deploy \
  -f backend/docker-compose.yml \
  -f docker-compose.override.yml \
  up -d --build
```

也就是说，`backend/docker-compose.yml` 是基础栈，`docker-compose.override.yml` 在根目录对它进行集成部署层增强。

完整运行时服务包括：

1. PostgreSQL
2. Redis
3. MinIO
4. Directus
5. Next.js frontend
6. Edge Nginx

整体访问模型是单一 public entrypoint：

```text
Browser / LAN / Public Client
  -> vitecover_edge / Nginx
    -> frontend:3000
    -> directus:8055 via /directus/*
```

Directus 在集成部署中保持 Docker 网络内部服务，不建议客户端直接访问 Directus 容器端口。

---

## 2. Directus 运行方式

### 2.1 基础 Compose 定义

Directus 在 `backend/docker-compose.yml` 中定义，使用镜像：

```yaml
directus/directus:11.12.0
```

基础栈中 Directus：

- 依赖 PostgreSQL healthcheck 通过。
- 依赖 Redis 启动。
- 使用 PostgreSQL 作为主数据库。
- 使用 Redis 地址 `redis://redis:6379`。
- 开启 websocket：`WEBSOCKETS_ENABLED=true`。
- 挂载本地上传目录到 `/directus/uploads`。
- 挂载 `backend/directus/extensions` 到 `/directus/extensions`。

基础文件中还保留了 `8055:8055` 的端口映射，以及一个 backend-only Nginx starter 服务。集成部署时，推荐入口不是这个 backend-only Nginx，而是根目录 override 后的 edge Nginx。

### 2.2 集成部署 override

在 `docker-compose.override.yml` 中，Directus 被增强为：

- 容器名：`vitecover_directus`
- 环境变量来源：`deploy/linux/.env.deploy`
- 依赖：PostgreSQL、Redis、MinIO
- 增加 Directus `KEY`、`SECRET`、管理员账号、`PUBLIC_URL`
- 增加 healthcheck：`/server/health`
- 对外只 `expose: 8055`

Directus 文件存储被配置为 MinIO：

```yaml
STORAGE_LOCATIONS: minio
STORAGE_MINIO_DRIVER: s3
STORAGE_MINIO_ENDPOINT: http://minio:9000
STORAGE_MINIO_BUCKET: ${MINIO_BUCKET}
STORAGE_MINIO_FORCE_PATH_STYLE: "true"
```

因此，在集成部署里，Directus 管理文件元数据，实际对象文件落在 MinIO bucket 中。

### 2.3 Directus 对外路径

Directus 对外路径统一通过 edge Nginx：

```text
http://host/directus/
http://host/directus/admin/
http://host/directus/assets/<file-id>
```

部署时应确保：

```env
PUBLIC_URL=http://your-host/directus
```

如果未来接入域名和 HTTPS，应把 `PUBLIC_URL` 调整为最终公网 URL，例如：

```env
PUBLIC_URL=https://example.com/directus
```

---

## 3. 前后端处理方式

### 3.1 前端运行方式

前端是 Next.js 应用，通过 `frontend/Dockerfile` 构建生产镜像。

Dockerfile 分三阶段：

1. `deps`：安装 npm 依赖。
2. `builder`：执行 `npm run build`。
3. `runner`：复制 `.next`、`node_modules`、`public`，执行 `npm run start`。

集成部署中 frontend 服务配置：

```yaml
frontend:
  build:
    context: ../frontend
    dockerfile: Dockerfile
  container_name: vitecover_frontend
  environment:
    NODE_ENV: production
    PORT: 3000
    DIRECTUS_INTERNAL_URL: http://nginx/directus
  expose:
    - "3000"
```

前端容器不直接暴露公网端口，只被 edge Nginx 代理。

### 3.2 前端访问 Directus

部署模板中包含：

```env
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_DIRECTUS_URL=
NEXT_PUBLIC_FILE_SERVICE_BASE_URL=
```

对于 LAN 或动态 IP 场景，这些 public 变量可以留空，让前端使用相对路径 `/directus/*`。

服务端内部访问 Directus 时使用：

```env
DIRECTUS_INTERNAL_URL=http://nginx/directus
```

这表示 Next.js API route 在容器网络内也通过 Nginx 的 `/directus` 路径访问 Directus，而不是直接打 `directus:8055`。这样内外路径更一致。

### 3.3 后端职责边界

当前不是传统单独 API 后端服务，而是：

- Directus：数据模型、数据库 CRUD、文件服务、admin UI、extensions。
- Next.js API routes：业务层封装，例如认证账户上下文、订单列表、PDF 生成和下载。
- PostgreSQL：业务数据持久化。
- Redis：Directus 缓存 / websocket 相关支撑。
- MinIO：私有文档和上传文件对象存储。

典型请求链路：

```text
Browser
  -> Nginx /
    -> Next.js page or API route
      -> Directus API through DIRECTUS_INTERNAL_URL
        -> PostgreSQL / MinIO
```

---

## 4. Nginx 搭建方式

### 4.1 Edge Nginx 服务

集成部署中，Nginx 容器名是：

```text
vitecover_edge
```

端口映射：

```yaml
ports:
  - "${EDGE_HTTP_PORT:-80}:80"
```

因此默认访问入口是：

```text
http://host/
```

如果 `.env.deploy` 中设置：

```env
EDGE_HTTP_PORT=8088
```

则访问入口是：

```text
http://host:8088/
```

### 4.2 Upstream

Nginx 定义两个 upstream：

```nginx
upstream vitecover_frontend {
    server frontend:3000;
}

upstream vitecover_directus {
    server directus:8055;
}
```

这依赖 Docker Compose 的服务名 DNS。

### 4.3 路由规则

当前路由规则：

| Path | 目标 |
| --- | --- |
| `/` | `frontend:3000` |
| `/directus/` | `directus:8055` |
| `/directus/admin/` | `directus:8055`，附加 same-origin 保护 |
| `/__fallback.html` | Nginx 内部 fallback 页面 |

`/directus/` 会先 rewrite 去掉 `/directus` 前缀：

```nginx
rewrite ^/directus/?(.*)$ /$1 break;
proxy_pass http://vitecover_directus;
```

并注入：

```nginx
proxy_set_header X-Forwarded-Prefix /directus;
```

这让 Directus 知道它处在 `/directus` 子路径之后。

### 4.4 安全默认值

Nginx 当前设置了：

- `client_max_body_size 25m`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Strict-Transport-Security`

注意：当前 Nginx 监听 HTTP 80。生产公网 HTTPS 应由更前面的负载均衡器、云网关或外层 reverse proxy 终止，再转发到该 edge Nginx。

---

## 5. PDF 生成服务架构

### 5.1 当前没有独立 PDF microservice

当前 PDF 生成逻辑位于 Next.js 应用代码中，而不是独立容器服务。

核心函数是 `buildContractPdfTemplate()`，它手工生成一个简化 PDF：

- 写入 `%PDF-1.4` header。
- 使用 Helvetica 字体。
- 将订单、产品、保障时间、金额、车辆、驾驶员等字段写入 PDF 文本流。
- 返回 PDF bytes。

这更像当前阶段的 demo/template PDF，不是正式复杂模板引擎。

### 5.2 PDF 生成流程

当前订单 PDF 生成流程大致是：

1. 根据客户 ID 和订单 ID 查询订单。
2. 如果已有 policy 且 `pdf_file` 已经是 PDF，则不重复生成。
3. 校验订单必须关联 vehicle、driver、product。
4. 查询 customer、vehicle、driver、product。
5. 调用 `buildContractPdfTemplate()` 生成 PDF bytes。
6. 通过 Directus `/files` API 上传 PDF。
7. 更新或创建 `policies` 记录。
8. 在 `policies.pdf_file` 中保存 Directus file id。
9. 写入 `pdf_generated_at`。
10. 写入 `document_version=template-pdf-v1`。

### 5.3 PDF 存储

PDF 上传入口是 Directus Files API：

```text
POST /directus/files
```

集成部署中 Directus 的 storage backend 是 MinIO，所以：

```text
Next.js
  -> Directus /files
    -> MinIO bucket
```

Directus 保存文件元数据，MinIO 保存实际 PDF 对象。

### 5.4 PDF 下载

客户下载 PDF 的业务入口是：

```text
GET /api/account/orders/[orderId]/pdf
```

该 route 会：

1. 校验用户是否登录。
2. 用当前 customer id 和 order id 查询 policy PDF file id。
3. 从 Directus asset 接口下载文件。
4. 返回 attachment 响应。
5. 设置 `Cache-Control: private, no-store`。

这符合“私有对象存储 + 认证应用流程下载”的方向。

### 5.5 后续演进建议

未来如果 PDF 复杂度上升，建议考虑：

- 独立 PDF service。
- HTML-to-PDF 渲染，例如 Playwright/Chromium service。
- 模板版本管理。
- 多语言模板。
- 电子签章 / 防篡改信息。
- 更严格的保单字段校验。
- 异步任务队列，避免用户请求同步等待 PDF 生成。

当前已有 `document_version` 字段，可以作为未来模板升级和兼容处理的入口。

---

## 6. MinIO 角色

MinIO 是当前对象存储层，作用是：

- 存储生成的 policy PDFs。
- 存储客户上传的私有文档。
- 以 S3-compatible API 模拟未来 AWS S3。
- 降低未来从本地部署迁移到 AWS S3 的成本。

Compose 中 MinIO：

```yaml
image: minio/minio:RELEASE.2025-02-28T09-55-16Z
container_name: vitecover_minio
command: server /data --console-address ":9001"
```

默认 console：

```text
http://host:9001/
```

`up.sh` 会在启动后通过 `mc mb -p` 确保 bucket 存在。

---

## 7. 部署步骤

### 7.1 首次部署

推荐在 Linux 服务器拉取完整仓库：

```bash
git clone <repo-url> VitecoverServer
cd VitecoverServer
```

首次执行：

```bash
./up.sh
```

如果 `deploy/linux/.env.deploy` 不存在，脚本会从模板创建它并提示修改。

编辑：

```bash
vim deploy/linux/.env.deploy
```

重点修改：

```env
DB_PASSWORD=...
DIRECTUS_KEY=...
DIRECTUS_SECRET=...
DIRECTUS_ADMIN_EMAIL=...
DIRECTUS_ADMIN_PASSWORD=...
PUBLIC_URL=http://your-host/directus
MINIO_ROOT_USER=...
MINIO_ROOT_PASSWORD=...
MINIO_BUCKET=vitecover-documents
EDGE_HTTP_PORT=80
```

然后再次执行：

```bash
./up.sh
```

### 7.2 启动后访问

默认 endpoint：

```text
http://your-host/          -> frontend
http://your-host/directus/ -> Directus
http://your-host:9001/     -> MinIO console
```

### 7.3 更新部署

推荐方式是 push 到 `dev` 分支触发 GitHub Actions self-hosted runner。

自动部署流程：

1. fetch 最新 `origin/dev`
2. hard reset 部署 checkout
3. 校验 workflow syntax、shell syntax、compose rendering、frontend buildability
4. 执行 `./up.sh`
5. 使用 `${RUNNER_WORKSPACE}/deploy-checkout` 作为专用部署路径

手动 fallback：

```bash
git pull
./up.sh
```

### 7.4 停止服务

```bash
docker compose --env-file deploy/linux/.env.deploy \
  -f backend/docker-compose.yml \
  -f docker-compose.override.yml \
  down
```

---

## 8. Code Review 关注点

### 8.1 Directus 暴露面

需要确认最终部署是否只通过 edge Nginx 暴露 Directus。

基础 Compose 中仍有：

```yaml
ports:
  - "8055:8055"
```

如果生产环境也加载该基础端口映射，需要确认是否符合安全预期。理想情况下，公网只暴露 Nginx 的 `EDGE_HTTP_PORT`。

### 8.2 HTTPS

当前 edge Nginx 只监听 HTTP。公网生产环境必须明确 HTTPS 终止位置：

- 云负载均衡器
- 外层 Nginx / Caddy / Traefik
- AWS ALB / CloudFront

并确保 `PUBLIC_URL`、`NEXT_PUBLIC_SITE_URL`、`NEXT_PUBLIC_DIRECTUS_URL` 与最终 HTTPS 域名一致。

### 8.3 Secret 管理

必须确认：

- `deploy/linux/.env.deploy` 不提交 Git。
- Directus `KEY` / `SECRET` 足够随机。
- 数据库密码、MinIO 密码不是默认值。
- GitHub Actions runner 部署路径没有未提交手工改动。

### 8.4 PDF 权限

当前业务 route 已有登录校验，并基于当前 customer id 查询订单 PDF。

仍建议 review：

- Directus asset 是否可能被公开访问。
- Directus role 权限是否允许匿名读取 files。
- MinIO bucket 是否保持 private。
- 下载链接是否应全部走 Next.js authenticated route，而不是直接暴露 Directus asset URL。

### 8.5 PDF 生成可扩展性

当前 PDF 是同步生成且模板较简单。

后续正式化时建议拆分为：

```text
Order paid / approved
  -> enqueue PDF generation job
    -> PDF service renders document
      -> upload to Directus / MinIO
        -> update policies.pdf_file
          -> notify customer
```

这样可以避免用户请求被 PDF 生成阻塞，也方便重试和审计。

### 8.6 自动部署纪律

仓库约定是 push 到 `dev` 触发 CI/CD。部署 checkout 会 hard reset 到 `origin/dev`，因此不要在部署目录中保留手工未提交修改。

---

## 9. 一句话总结

当前架构是一个适合项目早期和 Linux 单机部署的集成栈：

```text
Nginx single entrypoint
  + Next.js frontend/API routes
  + Directus backend/admin/files
  + PostgreSQL
  + Redis
  + MinIO S3-compatible private storage
```

它的优势是简单、路径统一、部署入口单一、未来可平滑迁移对象存储到 AWS S3。Code review 的重点应放在 Directus 暴露面、HTTPS 终止、secret 管理、PDF 文件权限、以及 PDF 生成从 demo template 向正式服务化方案演进的路径上。

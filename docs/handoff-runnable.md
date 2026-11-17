# 交付交接：可运行保障（任何人 clone 后 10 分钟打开）

> 目标：新机器/新环境 clone 本仓库后，按本文档执行即可完整体验 3D 叙事游戏。
> 最后更新：2026-11-14 · 由 Playtest/交付工程师验证（E2E 10/10 + 单测 35/35 背书）

## 0. 免 clone 快速体验

浏览器直接打开（无污染通道）：
- **GitHub Pages**：https://jinqiao-at.github.io/lux3d-space/ （主，大陆直连可达）
- Vercel：https://lux3d-lantern-demo.vercel.app （备，部分地区 DNS 污染需 4G）

## 1. 前置条件

| 项 | 要求 | 检查命令 |
|---|---|---|
| Node.js | ≥ 20 | `node -v` |
| pnpm | ≥ 9 | `pnpm -v` |
| 浏览器 | Chrome/Edge 任意现代版（3D 需 GPU） | — |
| Docker | 可选（仅后端 pg 模式需要） | `docker -v` |

前端**零环境变量、零后端依赖**——只装依赖就能玩。

## 2. 前端最小路径（推荐先跑这个）

```bash
git clone https://github.com/JinQiao-at/lux3d-space.git
cd lux3d-space/demo
pnpm install                      # 首次 1–2 分钟
pnpm exec vite --port 6120 --strictPort
# 浏览器打开 http://127.0.0.1:6120 → 点「开始探索」
```

- 17 件 Lux3D GLB 与 3DGS 点云资产已随仓库发布（`demo/public/`），无需任何生成步骤。
- 玩法速览：E 调查 · L 提灯 · Tab 档案 · F 叙事 Agent · M 地图 · Esc 暂停。

## 3. 可选：后端（知识检索 + LLM Agent 完整形态）

```bash
# ① pgvector 数据库
cd server
docker compose up -d                          # 端口 25433
# ② 灌知识库（纯内容即可跑词法检索；--embed 需智谱 key 走向量检索）
DATABASE_URL="postgresql://lux3d:lux3d@127.0.0.1:25433/lux3d" python scripts/seed_pg.py
# ③ FastAPI（pg 模式必须用启动器，Windows psycopg 异步要求 SelectorEventLoop）
LUX3D_MODE=pg DATABASE_URL="postgresql://lux3d:lux3d@127.0.0.1:25433/lux3d" python run.py
```

- `server/.env`（gitignored）可选配置：`LLM_API_KEY`（智谱 glm-4-flash 免费档，function calling）；不配则 Agent 自动降级本地规则引擎——**游戏始终可玩**。
- 无 Docker：不装后端，前端单独跑即用 mock 模式（本地规则引擎，同样通关）。

## 4. 测试与验证

```bash
cd demo
pnpm build                              # tsc --noEmit + vite build
pnpm test                               # node:test 单测 35 个（护栏契约）
npx playwright test                     # E2E（webServer 自动起 vite 6120；Edge channel）
npx playwright show-report
```

## 5. 常见坑表（Windows）

| 症状 | 原因 | 处理 |
|---|---|---|
| `EACCES: permission denied` 绑端口 | Windows 动态保留 TCP 段（5180/5800 等曾入段） | 换 6120 或任意段外端口；查段：`netsh interface ipv4 show excludedportrange protocol=tcp` |
| `pnpm install` 时 esbuild 报脚本禁用 | pnpm v11 默认阻止构建脚本 | 已通过 `demo/pnpm-workspace.yaml`（strictDepBuilds:false）解决，无需操作 |
| dev 端口通但页面白屏 | 浏览器 Secure DNS 解析到污染 IP | 换浏览器/关 Secure DNS；或用 Pages 链接 |
| 后端启动 `PoolTimeout` | Windows psycopg 异步要求 SelectorEventLoop | 必须用 `python run.py`（启动器已处理），不要直接 `python -m uvicorn` |
| GitHub push 失败 | 大陆 DNS 污染间歇 | 重试窗口直推；或 `gh api` 四步绕行；或 SSH over 443（ssh.github.com:443） |

## 6. DSH 运行时说明（老环境遗留）

`demo/README.md` 历史版本曾写死本机 DSH runtime 的 node/pnpm 绝对路径——**新环境不需要**：任何 ≥20 的 Node 与标准 pnpm 均可（见第 1 节）。

# 《提灯与暗门》Zork 3D Lux —— 项目报告书

> 基于 Microsoft 2025 开源的 Zork I 文案+谜题（emollick/zork-underground-empire，MIT），
> 用 Aholo Lux3D 生成 3D 资产，打造的第一人称 3D 动作冒险游戏。

---

## 1. 项目概述

**一句话定位**：把 1977 年的经典文字冒险《Zork I》变成可漫步的第一人称 3D 动作冒险——白宫西侧的开场白还在，但这次你真的能走进那扇 boarded 门。

- **技术栈**：Three.js 0.180（原生，非框架）· WebGL2 · TypeScript strict · Vite · Aholo Lux3D 资产链
- **内容规模**：30 区域 / 19 宝物 / 巨魔·盗贼·独眼巨人三生物 / 黑暗 Grue 威胁 / Stone Barrow 结局
- **测试**：77 个 node:test 用例（campaign/combat/darkness/inventory/mobile-controls 等 12 文件）
- **许可**：MIT（底座）+ 本项目修改部分 MIT · 致谢见 CREDITS.md

## 2. 工作流拆解（评委重点）

```
[emollick/zork-underground-empire 开源底座]
  git tarball 拉取（绕 DNS 污染）→ npm ci → 77 测试全绿基线
        ↓
[Aholo Lux3D 资产生成] —— MCP（26 工具）+ SDK API 双通道
  image_to_3d：提灯/日记/石台等 GLB（官方任务号可审计）
  world_generate：SpatialGen 3DGS 空间 2 处
        ↓
[gltf-transform + 群核 aholo-splat-transform 压缩]
  Meshopt + WebP1024：GLB 单件最大 1.26MB；PLY 34.5MB→5.45MB（-84%）
        ↓
[Three.js 渲染接入]
  GLTFLoader + MeshoptDecoder + Box3 归一化 + luxPropSync 替换层
  makeProp 工厂：命中 Lux3D 缓存→真实模型；未命中→程序化回退（零破坏）
        ↓
[Vercel + GitHub Pages 双轨部署]
  vercel.json（npm ci/build/dist + engines node 24.x）
  Pages workflow：push main → 35s 自动部署（绕 DNS 污染主通道）
```

**Lux3D 在流程中的位置**：负责全部核心物品的 3D 资产生成——
书桌/日记/书架/壁炉/地板暗门/镜/画/石阶/淋浴/浮雕/洗手台/转盘×3/暗门/石台/挂毯 17 件 GLB，
外加 SpatialGen 生成的记忆回廊与镜厅两处 3DGS 空间场景。

## 3. 资产迭代对比（替换前 vs 替换后）

| 物品 | 替换前（Zork 程序化） | 替换后（Aholo Lux3D GLB） |
|---|---|---|
| 书架 | boxGeometry 木色盒子+5 层板 | Lux3D 顶天立地书架（书脊/缝隙细节完整） |
| 日记本 | cluePaper 纸片几何 | Lux3D 摊开日记（纸页/墨迹/撕口质感） |
| 石台 | 圆柱+八边形底座 | Lux3D 密室石台（雕纹/风化层次） |
| 挂毯 | 平面+纹线 | Lux3D 织毯（镜像城市织纹完整） |
| 淋浴间 | 磨砂玻璃盒 | Lux3D 玻璃门+水垢质感 |
| 浮雕 | 平面符号 | Lux3D 立体浮雕（三点/一点/两点刻痕） |

对比截图：`docs/screenshots/`（程序化基线）vs `zork-playthrough/`（Lux3D 版实拍）；
三向审计表：任务号↔GLB↔registry **17/17 闭环**（原始 GLB 备份 raw-lux3d-backup/ 可回滚）。

## 4. 关键效果截图

- 白宫开局（West of House）：`zork-playthrough/z02-west-of-house.png`
- 厨房/客厅：`z05-kitchen-sandwich.png`
- 地下室（提灯照亮）：`02-basement.png`（consistency-check/）
- 密室（Lux3D 挂毯+石台）：`03-chamber.png`
- 黑暗威胁：`main-story` 基线 study-room 暗部
- 桌面/移动端 UI 对比：触屏摇杆+按钮（TouchControls）vs 桌面键位条

## 5. 技术亮点（三个最强）

### ① Aholo Lux3D 可审计资产生产线
17 件物品每一件都有官方任务号、raw/opt 双档、断点续跑 manifest；压缩链
quantize+simplify+Meshopt+WebP 单件 ≤800KB（1 件 1.26MB），加载零 CDN。
**AI 生成物永远弄不坏玩法**：GLB 缺失/损坏自动回退程序化几何（三层防御）。

### ② 纯函数状态机 × 77 测试即契约
applyAction 纯函数 + 77 个 node:test 用例锁定 campaign/谜题/存档/战斗/触控——
剧情推进可测试、可回归。Lux3D 替换层只换"皮"，测试全绿证明逻辑零破坏。

### ③ 移动端触控适配（Zork touch-controls 机制移植）
pointerId 多指角色分配（左半屏摇杆/右半屏视角）+ prefersTouchControls 检测
+ 左摇杆推远=跑 + 右下动作按钮——手机上与桌面同等可玩，纯逻辑层可单测。

## 6. 数据与验证

| 项 | 数据 |
|---|---|
| 测试 | npm test **77/77**（12 文件）+ E2E Playwright 全绿 |
| 性能 | DC <50 · Tris <320k · FPS 60（守门测试 perf-gate 长期生效） |
| 首帧 | GLB 全载 <6s（本地 dev；Pages 生产另测） |
| 资产 | 17 GLB 10.1MB（Meshopt 后）+ PLY 5.45MB + 字体包 |
| 部署 | Vercel prod READY + GitHub Pages 双轨 + 魔塔创空间（ModelScope，大陆直连推荐） |
| URL | GitHub（源代码）: https://github.com/JinQiao-at/zork-3d-lux · 在线体验: https://jinqiao-at.github.io/zork-3d-lux/ · Vercel 备: https://zork-3d-lux.vercel.app |


## 附：魔塔创空间（ModelScope Studios）部署指引

官方推荐可体验运行链接托管平台。步骤：
1. 登录 modelscope.cn → 创空间 → 创建（选静态 Nginx 基础模板）
2. 将 `dist/` 全部产物上传（或 git 集成 zork-3d-lux 仓）
3. 上线后把创空间公开链接填入提交表单「可体验运行的作品链接」

优势：大陆直连无 DNS 污染，加载速度最优。

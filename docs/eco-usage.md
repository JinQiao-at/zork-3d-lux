# Aholo 生态能力使用说明（eco-usage）

## 1. Aholo Lux3D —— 图生 3D 资产生成（核心，已勾选）

**使用说明**（约 100 字）：使用 Aholo Lux3D 的 image_to_3d 能力，将文生图产出的概念图转化为
PBR 材质 GLB 模型，为本项目生成了 17 件核心物品资产——橡木书桌、摊开的日记、顶天书架、
壁炉、地板暗门、落地镜、石壁浮雕画、螺旋石阶、淋浴间、石壁浮雕、铜管洗手台、三符号转盘×3、
石质暗门、密室石台、密室挂毯。每件资产带官方任务号可审计，经 gltf-transform+Meshopt 压缩后
接入 Three.js 渲染（GLTFLoader+MeshoptDecoder），替换前有程序化几何兜底。

**接入方式**：MCP（@manycore/aholo-sdk-mcp，26 工具 stdio 通道）+ SDK API
（`pipeline/lux3d/generate-assets.mjs` 直接 import `@manycore/aholo-sdk-mcp` 的 generateWorld/image_to_3d）。
**生成数量**：17 件 GLB（官方任务号 4625608-4657113 段可审计）+ 断点续跑 manifest。

## 2. Aholo SpatialGen —— 3DGS 空间生成（已勾选）

**使用说明**（约 100 字）：使用 SpatialGen 的 world_generate 能力生成两处 3DGS 空间场景——
「记忆回廊」（worldId 3FO4FN51MVSB）与「镜厅」（worldId 3FO4K4RMR6F9），产出 PLY 点云+
全景 JPG。PLY 经群核官方 @manycore/aholo-splat-transform lod:auto 降采样（-84%）后接入
gaussian-splats-3d 渲染，作为游戏结局后的叙事延伸空间。

**接入方式**：SDK API（`pipeline/world/generate-corridor.mjs` 调 generateWorld，wait 模式+产物下载）。

## 3. Aholo MCP Server —— 工具通道（已勾选）

**使用说明**：通过 @manycore/aholo-sdk-mcp 以 stdio 接入 Aholo MCP（26 工具），
覆盖资产生成/任务查询/空间重建全流程；另自建 `lux3d-narrative` MCP server
（FastMCP，6 工具）对外暴露游戏知识库检索与受控 Agent 问答。

**接入方式**：stdio（`pipeline/mcp/launch.mjs` + `.env.aholo`）。

## 未使用（不勾选）

- Aholo 实景重建（Reality 环拍）——计划项未执行
- Aholo 渲染云/效果图——未使用
- 其他生态组件——未使用

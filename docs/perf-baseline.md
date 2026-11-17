# 渲染性能基线（优化前）· 任务③

> 采集时间：2026-11-14（材质池改造前的历史实测记录汇总）
> 方法：`window.__glInfo`（renderer.info，App.tsx onCreated 挂载）+ rAF 2s 采样；书房场景（17 GLB 全载稳定后）

## 优化前基线（2026-11-11 实测，docs/findings/2026-11-11-playtest.md）

| 指标 | 数值 | 采集条件 |
|---|---|---|
| DrawCall | **40** | 书房场景，17 GLB 全载稳定 |
| Tris | **317k** | 同上 |
| FPS（记忆回廊 splat 渲染中段） | 39 | 3DGS FadeIn 中段（含点云负载） |
| 材质实例 | **~74 个独立 MeshStandardMaterial** | RoomShell.tsx 池化前逐 mesh 内联（study≈29 / basement≈33 / chamber≈12） |
| E2E 性能守门 | 无 | 无 DC/Tris/FPS 断言测试 |

## 优化面判定

1. **RoomShell 材质重复**：74 个实例中大量同参数重复（地砖 #22262a×15、水渍 #2f3538×10、踢脚线×4、横梁×3、石柱×4、墙四面各一）——材质编译/状态切换/GPU 上传冗余
2. **zone 切换材质重建**：内联材质随组件卸载 dispose，每次切 zone 全部重建（GPU 内存抖动）
3. **无守门测试**：性能回归无法被 CI 拦截

## 门槛设定依据（守门测试 perf-gate.spec.ts）

- DC<50：基线 40 + 15% 余量（新增渲染特性的安全空间）
- Tris<1M：基线 317k + 3 倍余量（高模资产验证空间）
- FPS≥30：3D 游戏流畅线下限

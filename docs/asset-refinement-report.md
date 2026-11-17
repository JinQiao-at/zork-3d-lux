# Lux3D 模型精修报告（任务②四档递进）· 2026-11-14

> 原则：零成本灯光后处理优先；GLB 文件零改动（三向审计不受影响）；每档可回退。
> 验证：build+35/35 单测+Playwright 11/11+perf-gate 2/2（DC 无反弹）+视觉回归 4/4（差异 <5% 容差）。

## 档0（零成本渲染器）✅ 采用

- App.tsx Canvas 显式 `gl.toneMapping: ACESFilmicToneMapping` + `toneMappingExposure: 1.12`
- 收益：暗部层次提升（提灯暖光/烛火高光不过曝），渲染管线显式化（此前依赖 three 隐式默认）

## 档1（灯光后处理）✅ 采用

三 zone 各补一盏低强度 fill pointLight（无新依赖，DC +3 在守门余量内）：

| zone | fill | 目的 |
|---|---|---|
| 书房 | #ffe8c8 / 0.28 / 中心上方 | 书架/油画暗角填充，GLB 材质可读性 |
| 地下室 | #8fb8cc / 0.14（提灯后）/ 低位 | 黑暗氛围保持+浮雕/转盘 GLB 底光 |
| 密室 | #d8e4ff / 0.3 / 朝石台 | 挂毯织纹/石台刻痕细部可读性 |

FlickerLight 抖动机制不动（氛围核心）。

## 档2（材质精修）✅ 采用

**PMREMGenerator + RoomEnvironment**（three 内置合成环境，零 CDN）：
- World.tsx 一次性生成 `scene.environment`（`environmentIntensity: 0.35` 压低保持暗调）
- GLB 的 MeshStandardMaterial 获得 IBL 反射——金属件（管道/铜管/提灯壳）高光不再死板，织纹/石面出现环境层次
- 一次性 PMREM 成本，全局共享；卸载时 dispose 回收

## 档3（按需重压）❌ 不需要

判定依据：档 0-2 落地后视觉回归 4/4 全过（差异 <5% 容差），无资产劣化证据；17 GLB 已做 quantize+simplify+Meshopt+WebP1024 四重压缩，重压收益低、重新审计成本高——**默认不动**（后续如需单件纹理升级再走档 3 流程）。

## 效果对比

- 视觉：暗部可读性↑、GLB 高光/反射层次↑、三 zone 氛围保持（对比路径：`demo/tests/e2e/main-story.spec.ts-snapshots/`，视觉回归 4/4 在容差内）
- 性能：DC 40→43（fill 光 +3，守门余量内）；Tris/FPS 无反弹（perf-gate 2/2 绿）
- 审计：GLB 文件零改动——三向审计表 17/17 仍有效

## 精修清单（本报告口径）

| 精修项 | 档位 | 文件 |
|---|---|---|
| ACESFilmic + 曝光 1.12 | 档0 | App.tsx |
| 三 zone fill 光 | 档1 | Lighting.tsx |
| scene.environment（PMREM+RoomEnvironment, 0.35） | 档2 | World.tsx |
| GLB 重压 | 档3 未触发 | — |

# 《提灯与暗门》The Lantern and the Hidden Door · Zork 3D Lux

> 基于 Microsoft 2025 开源的 Zork I 文案与谜题（经 emollick/zork-underground-empire 转译），
> 用 **Aholo Lux3D** 生成 3D 资产，打造的第一人称 3D 动作冒险游戏。
> MIT 开源 · 30 区域 · 19 宝物 · 黑暗 Grue · 触屏+桌面双端可玩。

- **🎮 在线试玩（免安装）**：https://jinqiao-at.github.io/zork-3d-lux/
- **🎥 Demo 视频**：（录制后回填）
- **📄 项目报告**：[docs/report/report.md](docs/report/report.md)

![West of House](docs/screenshots/zork-playthrough/z02-west-of-house.png)

## 快速开始

```bash
git clone https://github.com/JinQiao-at/zork-3d-lux.git
cd zork-3d-lux
npm ci
npm run dev          # http://127.0.0.1:5193/
npm test             # 77 用例
npm run check        # tsc --noEmit
npm run build        # 产物 dist/
```

- **桌面**：WASD 移动 · 鼠标环视 · Shift 快走 · E 交互 · ESC 暂停 · 左右方向键转身 · PageUp/Down 俯仰
- **触屏**：左下摇杆滑动移动（推远=跑）· 右半屏滑动环视 · 右下「交互/提灯」按钮

## 玩法

白宫西侧的开场白还在——但这次你真的走进去。30 个区域、19 件宝物、
潜伏在黑暗里的 Grue、巨魔与盗贼。拿起剑，点亮灯，
把散落的宝藏找回 Satchel，向 Stone Barrow 进发。

## 资产

全部场景为程序化生成（`src/world.ts` 2536 行）+ **Aholo Lux3D 真实 GLB 替换层**
（`src/lux-props.ts`：提灯/日记/石台三件已接入，任务号可审计）。
资产账本：`public/models/` + 压缩链 gltf-transform Meshopt。

## 致谢与许可

- 底座：[emollick/zork-underground-empire](https://github.com/emollick/zork-underground-empire)（MIT）——本作品基于其修改
- Zork I 文案与谜题版权归其权利人；3D 资产由群核科技 Aholo Lux3D 生成
- 详见 [CREDITS.md](CREDITS.md) 与 [docs/eco-usage.md](docs/eco-usage.md)

## License

MIT

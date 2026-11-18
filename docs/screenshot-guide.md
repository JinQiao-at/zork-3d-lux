# LUX3D 模型截图点位清单（用户照此截取）

> 目标：拿「Lux3D 模型在游戏里」的截图。以下点位全部真实存在于已部署版本。
> 推荐：手机 4G 打开在线版截屏；桌面浏览器 F11 全屏+系统截图工具亦可。

## 在线地址

https://jinqiao-at.github.io/zork-3d-lux/ （GitHub Pages，大陆直连）

## 点位（按游戏进程顺序）

| # | 位置 | 怎么到 | 截什么 |
|---|---|---|---|
| 1 | 标题屏 | 打开首页即见 | 《提灯与暗门》标题+开始按钮（含 favicon 标识） |
| 2 | 白房子全景 | 点开始 → 章节字幕后 | West of House 白房子+树林+雾（对标 Zork 原版开场） |
| 3 | **书架（Lux3D GLB）** | 走到西墙书架前 | Lux3D 顶天书架模型特写（替换程序化盒子的实证） |
| 4 | **日记本（Lux3D GLB）** | 走到书桌前看桌面 | Lux3D 摊开日记特写（J 日记面板里可对照原文） |
| 5 | 厨房三明治 | 厨房桌上 | 辣椒三明治（Zork I 经典梗） |
| 6 | 地下室浮雕 | 下地下室看北墙 | Lux3D 立体浮雕（三点/一点/两点） |
| 7 | **石台（Lux3D GLB）** | 密室中央 | Lux3D 石台册子特写（A16-024） |
| 8 | **挂毯（Lux3D GLB）** | 密室东墙 | Lux3D 挂毯（镜像城市织纹+A16-025 钩子） |
| 9 | 触屏摇杆 | 手机打开 → 左下 | 虚拟摇杆+右下交互/提灯按钮 |
| 10 | 黑暗对比 | 手机/桌面：走到无光区 | 全黑画面+「提灯是唯一能带下去的光」 |

## 快捷方式（30 秒拿全套）

开发者工具 Console 逐条粘贴（每条截一张）：

```js
// 1. 传送至书架特写机位
window.__playerCamera.position.set(-2.6, 1.55, -0.8);
window.__playerCamera.lookAt(-4.55, 1.3, -0.8);
// 2. 日记特写
window.__playerCamera.position.set(0, 1.25, -1.55);
window.__playerCamera.lookAt(0, 0.95, -2.35);
// 3. 石台特写
window.__playerCamera.position.set(0, 1.45, -2.15);
window.__playerCamera.lookAt(0, 0.85, -3.55);
// 4. 挂毯特写
window.__playerCamera.position.set(1.2, 1.4, -2.2);
window.__playerCamera.lookAt(0, 1.15, -3.5);
```

（传送钩子仅 DEV 构建有效——GitHub Pages 生产构建无此钩子，需本地 `npm run dev` 打开 6120 端口后使用）

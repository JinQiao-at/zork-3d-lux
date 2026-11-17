# Lux3D 资产 ↔ Zork 游戏物品映射表（asset-mapping）

> 用途：把 lux3d-space 的 17 件 Lux3D GLB 替换进 Zork 开源项目（emollick/zork-underground-empire）的程序化模型。
> Zork 渲染入口：`src/models.ts` 的 `makeProp(type, materials)` switch 工厂——所有物品按 `type` 字符串分派到程序化绘制函数。
> 替换策略（每件相同）：在 makeProp 对应 case 里改为加载 `public/models/<lux3d-id>.glb`（GLTFLoader+MeshoptDecoder+包围盒归一化），程序化函数保留作回退。
> 本表只做映射与改动点定位，不改代码（任务③只换 3 件：提灯/日记/宝物各一）。

## 一、Zork 核心物品 → Lux3D 替换（任务③范围）

| 游戏物品 | makeProp type | 现状（程序化函数） | 替换用 Lux3D GLB | 改动文件 | 风险 |
|---|---|---|---|---|---|
| 提灯 lantern | `lantern`/`lamp`/`resting_lantern` | `lantern()` 程序化（铜壳+提环+焰 bulb，resting 变体焰熄灭） | **obj_study_bookshelf.glb 场景中提灯** → 实为提灯本体无独立 GLB（Lux3D 17 件无提灯），建议用 **镜厅/书房 Lux3D 补生成一件提灯** 或沿用程序化+贴图升级 | src/models.ts L447/L459（三 case 共用） | 中：resting 变体有焰熄灭状态语义，GLB 需带可切换 emissive |
| 日记本 journal（玩家侧 J 键面板） | 非场景物件——UI HTML 面板 | DOM overlay（不进 3D） | **obj_study_diary.glb**（摊开日记，Lux3D 真实资产） | 场景物件对应 Zork `torn_note`/`book`（src/models.ts L444/L484 `cluePaper`/`book()`） | 低：diary GLB 摊开形态与 book() 同构 |
| 宝物（背包 19 件之一） | `egg`（森林彩蛋，Zork 首件宝物） | `egg()` 程序化 | **obj_chamber_pedestal.glb 的石台册子** 语义不符；建议用 **obj_study_diary.glb 同系列**或 egg 保留程序化 | src/models.ts L543 | 中：宝物计分逻辑绑定 type 字符串，换皮不换逻辑则安全 |

## 二、Lux3D 17 件完整映射（对 Zork 场景物件）

| Lux3D GLB | Zork makeProp type | Zork 场景位置 | 替换价值 |
|---|---|---|---|
| obj_study_desk.glb（橡木书桌） | `table`（L496） | 厨房等室内桌 | 高（主叙事锚点） |
| obj_study_diary.glb（摊开日记） | `book`（L484）/`torn_note`（L444） | 书房/信件 | 高（日记=J 面板同源） |
| obj_study_bookshelf.glb（书架） | 无直接对应（Zork 无书架 prop） | 低（新增 prop 需扩 campaign） |
| obj_study_fireplace.glb（壁炉） | 无（Zork 无壁炉 prop） | 低 |
| obj_study_floor_door.glb（地板暗门） | `hatch`（L443，external 标记） | 高（trapdoor 直接对应） |
| obj_study_mirror.glb（落地镜） | 无 direct（mirror_tablet 是浮雕） | 低 |
| obj_study_painting.glb（石壁浮雕画） | `painting`（L616，宝物画） | 中（宝物画可换真画） |
| obj_basement_stairs.glb（螺旋石阶） | 无（route/surfaces 承载） | 低 |
| obj_basement_shower.glb（淋浴间） | 无 | 低 |
| obj_basement_mural.glb（石壁浮雕） | `royal_relief`/`carved_warning`（L445 carvedFragment） | 中 |
| obj_basement_basin.glb（铜管洗手台） | 无 | 低 |
| obj_basement_dial_1/2/3.glb（转盘×3） | 无（Zork 无转盘谜题） | 低 |
| obj_basement_secret_door.glb（石质暗门） | `hatch`/barrier 视觉（routeBarriers） | 中 |
| obj_chamber_pedestal.glb（密室石台） | `chest`/`trunk`（L542 容器类） | 中 |
| obj_chamber_tapestry.glb（密室挂毯） | `rug`（L485） | 中 |

## 三、生物（不在本批替换范围）

| 生物 | 现状 | 备注 |
|---|---|---|
| troll 巨魔 | `makeCreature('troll')`（models.ts L93+ 铁/骨/皮革材质组） | Lux3D 无对应模型——保持程序化 |
| thief 盗贼 | 同上 thief 材质组 | 保持程序化 |
| grue / cyclops | 同体系 | 保持程序化 |

## 四、通用 GLB 加载小组件设计（任务③用）

Zork 是纯 three（无 R3F），加载组件放 `src/lux3d-glb.ts`：
```ts
// GLTFLoader + MeshoptDecoder（meshopt 已在压缩链）+ Box3 归一化到 fitSize
// + material 兼容（Zork palette 材质与 GLB PBR 并存）
// + dispose()（memory 治理：geometries/materials/textures 全释放）
// 挂点：makeProp 每个 case 在程序化生成前检查 public/models/<id>.glb 探测缓存（复用 lux3d-space 的 HEAD 探测模式）
```
风险：Zork 无 npm meshopt 依赖——需加 `meshoptimizer` 包或退化为 DRACOLoader 关闭+仅位置量化压缩重导出。

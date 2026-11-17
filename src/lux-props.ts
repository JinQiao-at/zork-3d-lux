/**
 * Lux3D GLB 同步替换层（zork-3d-lux 任务③）：makeProp 三 case 的真实模型替换。
 *
 * - preloadLuxProps()：游戏启动时异步预加载 3 个 GLB 到内存缓存（Meshopt 解码）；
 * - luxPropSync(type)：makeProp 同步查询缓存——命中则返回 Lux3D 模型 clone（替换程序化皮），
 *   未命中返回 null（回退原程序化函数，零破坏）；
 * - 只换"皮"：坐标/碰撞/交互逻辑全在调用方（campaign/game），不触碰。
 */
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'

const loader = new GLTFLoader()
loader.setMeshoptDecoder(MeshoptDecoder)

/** Lux3D GLB → Zork 物品 type 映射（任务② asset-mapping 落地）。 */
const LUX_PROPS: Record<string, string> = {
  lantern: 'lantern-bookshelf', // 提灯（挂在书架暗格的 resting_lantern/lantern）
  torn_note: 'journal', // 日记/信纸 → 摊开的日记本 GLB
  book: 'journal',
  egg: 'treasure-pedestal', // 首件宝物（森林彩蛋位）→ 石台册子 GLB
}

const cache = new Map<string, THREE.Object3D>()

/** 启动时预加载（幂等）；完成前 makeProp 一律回退程序化。 */
const ready = (async () => {
  const names = [...new Set(Object.values(LUX_PROPS))]
  await Promise.all(
    names.map(
      (name) =>
        new Promise<void>((resolve) => {
          loader.load(
            `models/${name}.glb`,
            (gltf) => {
              const group = gltf.scene
              group.name = `lux:${name}`
              cache.set(name, group)
              resolve()
            },
            undefined,
            () => resolve(),
          )
        }),
    )
  )
})()

/** 同步取 Lux3D 模型 clone（深度复制，独立 transform）。未加载/未命中返回 null。 */
export function luxPropSync(zorkType: string): THREE.Object3D | null {
  const name = LUX_PROPS[zorkType]
  if (!name) return null
  const source = cache.get(name)
  if (!source) return null
  return source.clone(true)
}

export async function preloadLuxProps(): Promise<void> {
  await ready
}

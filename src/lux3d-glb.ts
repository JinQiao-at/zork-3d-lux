/**
 * Lux3D GLB 通用加载器（zork-3d-lux）：GLTFLoader + MeshoptDecoder + 包围盒归一化 + dispose。
 *
 * - 优先加载 `public/models/<name>.glb`（Lux3D 真实资产），失败返回 null（调用方回退程序化）；
 * - Meshopt：压缩 GLB 需要 decoder——MeshoptDecoder 从 three examples 引入（零 CDN）；
 * - dispose：几何/材质/纹理全释放（切场景/卸载时调用）。
 */
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'

const loader = new GLTFLoader()
loader.setMeshoptDecoder(MeshoptDecoder)

const cache = new Map<string, THREE.Object3D | null>()

/** 归一化：包围盒居中 XZ + 底部 y=0 + 可选等比缩放到 fitSize（米制，1u=1m）。 */
export function normalizeToGround(group: THREE.Group, fitSize?: number): THREE.Object3D {
  const box = new THREE.Box3().setFromObject(group)
  const size = box.getSize(new THREE.Vector3())
  const center = box.getCenter(new THREE.Vector3())
  const scale = fitSize ? fitSize / Math.max(size.x, size.y, size.z, 1e-6) : 1
  const wrapper = new THREE.Group()
  wrapper.scale.setScalar(scale)
  group.position.set(-center.x * scale, -box.min.y * scale, -center.z * scale)
  wrapper.add(group)
  return wrapper
}

/** 探测 + 加载一个 Lux3D GLB；缓存成功结果。失败（404/解析错）返回 null。 */
export async function loadLuxGlb(name: string, fitSize?: number): Promise<THREE.Object3D | null> {
  const key = `${name}|${fitSize ?? ''}`
  if (cache.has(key)) return cache.get(key)!
  try {
    const url = `models/${name}.glb`
    const probe = await fetch(url, { method: 'HEAD', cache: 'no-store' })
    if (!probe.ok) {
      cache.set(key, null)
      return null
    }
    const contentType = (probe.headers.get('content-type') ?? '').toLowerCase()
    if (contentType.includes('text/html')) {
      cache.set(key, null)
      return null
    }
    const gltf = await loader.loadAsync(url)
    const normalized = fitSize ? normalizeToGround(gltf.scene, fitSize) : gltf.scene
    cache.set(key, normalized)
    return normalized
  } catch {
    cache.set(key, null)
    return null
  }
}

/** 内存治理：释放指定缓存的 geometry/material/texture。 */
export function disposeLuxGlb(name: string): void {
  const entry = cache.get(name)
  if (!entry) return
  entry.scene.traverse((object: THREE.Object3D) => {
    const mesh = object as THREE.Mesh
    if ((mesh as unknown as { isMesh?: boolean }).isMesh) {
      mesh.geometry.dispose()
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
      for (const material of materials) material.dispose()
    }
  })
  cache.delete(name)
}

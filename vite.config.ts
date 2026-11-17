import { defineConfig } from 'vite'

// GitHub Pages 子路径部署（/zork-3d-lux/）：base 用相对路径，资产/字体/GLB 全部随页面路径解析。
export default defineConfig({
  base: './',
  server: { host: '127.0.0.1', port: 5193, strictPort: false },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // base: '/disney_quiz/', // GitHub Pages用設定（Vercelではルートに配置するためコメントアウト）
})

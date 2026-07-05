import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import fs from 'fs'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'parts-api',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/api/parts' && req.method === 'POST') {
            let body = ''
            req.on('data', (chunk) => {
              body += chunk
            })
            req.on('end', () => {
              try {
                const payload = JSON.parse(body)
                const { name, category, description, inStock, imageBase64, imageExtension } = payload

                const partsFilePath = path.resolve(__dirname, 'src/data/parts.json')
                const parts = JSON.parse(fs.readFileSync(partsFilePath, 'utf8'))

                let nextNum = parts.length + 1
                let id = `part-${String(nextNum).padStart(3, '0')}`
                while (parts.some((p: any) => p.id === id)) {
                  nextNum++
                  id = `part-${String(nextNum).padStart(3, '0')}`
                }

                let imageUrl = ''
                if (imageBase64) {
                  const extension = imageExtension || 'jpg'
                  const filename = `${id}.${extension}`
                  const imagePath = path.resolve(__dirname, 'public/parts', filename)
                  const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '')
                  fs.writeFileSync(imagePath, Buffer.from(base64Data, 'base64'))
                  imageUrl = `/parts/${filename}`
                }

                const newPart = {
                  id,
                  name,
                  category,
                  image: imageUrl,
                  description,
                  inStock: inStock ?? true,
                }

                parts.push(newPart)
                fs.writeFileSync(partsFilePath, JSON.stringify(parts, null, 2), 'utf8')

                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ success: true, part: newPart }))
              } catch (err: any) {
                res.writeHead(500, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ success: false, error: err.message }))
              }
            })
          } else {
            next()
          }
        })
      }
    }
  ],
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://localhost:5088',
  //       changeOrigin: true,
  //     },
  //     '/parts': {
  //       target: 'http://localhost:5088',
  //       changeOrigin: true,
  //     },
  //   },
  // },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})

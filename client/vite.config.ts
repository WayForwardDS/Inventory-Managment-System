// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     host: '0.0.0.0',  
//     port: 5173,      
//   },
//   // build: {
//   //   sourcemap: false, 
//   //   minify: 'terser', 
//   //   terserOptions: {
//   //     compress: {
//   //       drop_console: true,
//   //       drop_debugger: true,
//   //     },
//   //   },
//   // },
// })

import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'dist' // Relative to /client
  }
})


import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// 证书文件路径
const certPath = path.resolve(__dirname, 'cert');

export default defineConfig({
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src'),
    },
  },
  plugins: [react()],
  server: {
    open:true,
    https: {
      key: './cert/localhost-key.pem',
      cert: './cert/localhost.pem',
    },
    host: 'localhost', // 确保主机名为 localhost
    port: 3001, // 指定服务器端口
    // proxy: {
    //   '/api': {
    //     target: 'https://rmp-dev.deltaww.com', // 目标 API 地址
    //     changeOrigin: true, // 修改请求的来源为目标地址
    //     secure: false, // 忽略 HTTPS 校验（如果后端使用的是自签名证书）
    //     rewrite: (path) => path.replace(/^\/api/, ''), // 可选，重写路径（如后端不需要 '/api' 前缀）
    //   },
    // },
  },
});

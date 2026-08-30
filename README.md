# mainweb

Azraelkaxi 的个人主站。前端是 React 个人主页，后端目录预留给后续接口。

## 目录

```
mainweb/
  frontend/   React + Vite + TypeScript
  backend/    预留
```

本地开发：

```bash
cd frontend
npm install
npm run dev
```

生产构建：

```bash
cd frontend
npm run build
```

构建产物在 `frontend/dist`，发布到服务器 `/www/apps/mainweb/app`，由 Nginx 80 端口对外提供。站点配置在 `deploy/`。

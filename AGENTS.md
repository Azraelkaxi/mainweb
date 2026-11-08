# mainweb 仓库约定

这是 Azraelkaxi 的个人主站，React 19 + Vite + TypeScript。人类和自动机器人（`.github/workflows/ai-*.yml`）都按本文件执行。

## 先读

1. `STYLE.md`：视觉模板。配色、字体、版式、路由、组件都以它为准。
2. `README.md`：目录和本地命令。
3. `frontend/src/`：现有组件、页面、数据、游戏逻辑。

## 命令

在 `frontend/` 下：

```bash
npm ci
npm run lint
npm run build
```

三个都必须通过。构建产物在 `frontend/dist`，不要提交。

## 目录

```
frontend/src/components/   壳、导航、星图、页头、分节、横排列表、页脚
frontend/src/pages/        路由页面
frontend/src/data/         站点文案、帖子元数据、游戏入口
frontend/src/games/        游戏纯逻辑（与 UI 分离）
frontend/src/posts/        帖子 Markdown
frontend/src/styles/       tokens / base / components
deploy/                    Nginx 配置，不改
backend/                   预留，不改
```

## 改代码时

- 新页面先组 `Shell / Page / Hero / Section / RowList / Footer`，再写业务。
- 样式加在 `frontend/src/styles/components.css`，新 token 加在 `tokens.css`。
- 文案用中文，语气克制，跟现有页面一致。
- 游戏逻辑放 `games/`，页面只负责状态和渲染。
- 帖子只加 `frontend/src/posts/*.md`，front matter 用 `title / date / excerpt`。
- 一次只做 issue 要求的事，不做无关重构，不批量改格式。
- 改动尽量小，一个 PR 只解决一个 issue。

## 不要

- 不加第二套配色、字体、字号阶梯或强调色。
- 不引 UI 库、CSS 框架、状态管理库。
- 不加新依赖。需要新依赖时停下来，在 issue 里说明，不要自己改 `package.json`。
- 不碰 `.github/`、`deploy/`、`backend/`、`.env*`、`node_modules/`、`dist/`。
- 不改 `vite.config.ts`、`tsconfig*.json`。
- 不把证书、密钥、服务器信息写进前端。
- 不执行 `git commit`、`git push`、`git checkout`，自动化工作流会处理。
- 不删除或重写与本 issue 无关的文件。

## 信息不足时

不要猜。把最多 3 个问题写进「需要确认」，然后停止。人类会补充后再让你继续。

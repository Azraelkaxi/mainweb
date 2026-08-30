# 主站视觉模板

后续 mainweb 页面和组件沿用这一套，不要另起配色或字体。实现以 `frontend/src/styles/` 和 `frontend/src/components/` 为准。

## 气质

暗色纸面、衬线大标题、细分割线、少装饰。琥珀金只做点缀（眉题、悬停、箭头），不要铺成大色块或渐变按钮。

## 色板

| Token | 值 | 用途 |
|---|---|---|
| `--bg` | `#0c0b09` | 底 |
| `--bg-raise` | `#141311` | 略抬一层的表面 |
| `--ink` | `#f3eee4` | 主文字、标题 |
| `--muted` | `#8f877b` | 说明、导航、页脚 |
| `--line` | `rgba(243, 238, 228, 0.12)` | 分割线 |
| `--amber` | `#d4a056` | 强调 |
| `--amber-dim` | `rgba(212, 160, 86, 0.16)` | 强调底 |

背景允许两处很淡的琥珀光晕 + 一层纸纹噪声，不要再加紫色、霓虹或卡片阴影。

## 字体

- 展示 / 品牌 / 大标题：`--serif` = Instrument Serif
- 正文 / UI：`--sans` = Outfit，中文回退苹方 / 微软雅黑
- 字号：正文 16 / 1.6；眉题与栏目标题 13px、宽字距、大写；主标题 `clamp(56px, 12vw, 104px)`；列表名 28px 衬线

字体从 `index.html` 的 Google Fonts 引入，新增页面不要换字体链接。

## 版式

- 全站左侧导航：宽 `--rail-width`（232px），右边是舞台
- 首页铺满舞台，星图画布 + 大标题；内页栏宽仍是 `min(920px, 100% - 40px)`
- 区块用顶部分割线，不要卡片栅格
- 列表用横排行（名 / 说明 / ↗），悬停名称变琥珀
- 页脚细线 + 13px muted
- 断点 `720px`：左侧栏改顶栏，列表改单列，隐藏箭头

## 路由

| 路径 | 页面 |
|---|---|
| `/` | 理想国首页 |
| `/about` | 站长信息（原主页内容） |

## 组件

新页面先组这些，再写业务：

| 组件 | 文件 |
|---|---|
| 左侧壳 | `frontend/src/components/Shell.tsx` |
| 星图 | `frontend/src/components/Field.tsx` |
| 内页栏 | `frontend/src/components/Page.tsx` |
| 导航 | `frontend/src/components/Nav.tsx` |
| 英雄区 | `frontend/src/components/Hero.tsx` |
| 分节 | `frontend/src/components/Section.tsx` |
| 横排列表 | `frontend/src/components/RowList.tsx` |
| 页脚 | `frontend/src/components/Footer.tsx` |

样式类名不要改；新样式加在 `frontend/src/styles/components.css`，新 token 加在 `tokens.css`。

## 不要

- 圆角大卡片、阴影按钮、紫色渐变、居中营销落地页
- 另一套字号阶梯或第二强调色
- 把证书、密钥写进前端

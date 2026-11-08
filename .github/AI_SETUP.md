# AI 自动实现流程

目标：开一个 issue，AI 先复述需求；你回 `/approve`，AI 写代码、开 PR；CI 绿了自动 squash merge；合并后自动部署到服务器。

```
issue（你开）
  └─ AI 分析 → 在 issue 里回复「需求理解」
       ├─ 你回 /approve
       │    └─ AI 开分支 → 改代码 → lint + build → 开 PR
       │         └─ CI 通过 → 自动 squash merge → Deploy → 同步到 /www/apps/mainweb/app
       └─ 你回 /reject → 关 issue
```

## 已经做好的

- `.github/workflows/ci.yml`：PR 和 main 上跑 lint + build，上传 `dist` 产物。
- `.github/workflows/ai-spec.yml`：issue 打开后，AI 只读分析并回复需求理解。
- `.github/workflows/ai-build.yml`：`/approve` 后，AI 在 `ai/issue-<n>` 分支改代码并开 PR。
- `.github/workflows/ai-reject.yml`：`/reject` 关闭 issue。
- `.github/workflows/deploy.yml`：main 的 CI 成功后，按同一个 commit 重新构建，用 `rsync` 同步 `dist` 到服务器，并做一次 HTTPS 冒烟测试。构建放在 Deploy 里而不是复用 CI 产物，是因为跨 run 下载 artifact 会偶发 `Artifact not found`，重跑也一样；重新构建只多花几十秒，但结果确定。
- `.github/ai/opencode.json`：CI 专用的模型、agent 和权限。只复制到 runner 的 `~/.config/opencode/`，不影响本地。
- `AGENTS.md`：AI 和人类共用的仓库约定。
- 本机生成了部署密钥 `mainweb/.deploy/mainweb_deploy`（已被 `.gitignore` 排除），对应公钥备注 `github-actions-mainweb`。
- 公钥已加入服务器 `/root/.ssh/authorized_keys`（2026-11-08，经用户明确授权一次；Agent 平时不改 `/root/.ssh`）。撤销时删掉带 `github-actions-mainweb` 的那一行。

## 还需要你手动做

### 0. 部署公钥（已完成）

公钥 `github-actions-mainweb` 已在服务器 `/root/.ssh/authorized_keys` 里，`ssh -i .deploy/mainweb_deploy root@43.133.230.43` 验证通过。要撤销就删掉那一行。

### 1. 登录 gh

```powershell
gh auth login
```

### 2. 三个 Secrets

仓库 → Settings → Secrets and variables → Actions → New repository secret。

| 名称 | 值 |
|---|---|
| `HAORAN_API_KEY` | 本机 `C:\Users\m1345\.config\opencode\haoran.key` 的内容 |
| `BOT_TOKEN` | 细粒度 PAT，见下 |
| `DEPLOY_SSH_KEY` | `D:\develop\code\web\mainweb\.deploy\mainweb_deploy` 的完整内容 |

命令行方式：

```powershell
(Get-Content "$env:USERPROFILE\.config\opencode\haoran.key" -Raw).Trim() |
  gh secret set HAORAN_API_KEY --repo Azraelkaxi/mainweb

Get-Content "D:\develop\code\web\mainweb\.deploy\mainweb_deploy" -Raw |
  gh secret set DEPLOY_SSH_KEY --repo Azraelkaxi/mainweb

gh secret set BOT_TOKEN --repo Azraelkaxi/mainweb
```

先把这三个 secret 配好，再把工作区改动推到 `main`。否则第一次 `Deploy` 会因为缺 secret 失败（站点不会被改坏）。

`BOT_TOKEN` 用细粒度 PAT，不要用经典 PAT：

- 地址：<https://github.com/settings/personal-access-tokens/new>
- Repository access：Only select repositories → `Azraelkaxi/mainweb`
- Permissions：
  - Contents：Read and write
  - Issues：Read and write
  - Pull requests：Read and write
  - Metadata：Read（自动带上）
- 有效期建议 90 天，到期前换掉。

为什么要 PAT：用 `GITHUB_TOKEN` 推的分支和开的 PR 不会再触发其他 workflow，CI 和 Deploy 都不会跑。

### 3. 打开 auto-merge

仓库 → Settings → General → Pull Requests → 勾选 **Allow auto-merge**。

或在已登录 `gh` 后：

```powershell
gh api -X PATCH repos/Azraelkaxi/mainweb -F allow_auto_merge=true
```

### 4. 保护 main

仓库 → Settings → Branches → Add branch protection rule：

- Branch name pattern：`main`
- 勾选 **Require a pull request before merging**
  - Required approvals：`0`
- 勾选 **Require status checks to pass before merging**
  - 搜索并选中 `build`
- 勾选 **Require branches to be up to date before merging**（可选，但推荐）
- 勾选 **Do not allow force pushes**
- 勾选 **Do not allow deletions**

这样 AI 的 PR 必须等 CI 绿才会被自动合并；即使 auto-merge 被误开，也不会把红的代码合进 main。

### 5. 确认 Actions 权限

仓库 → Settings → Actions → General → Workflow permissions：

- 选择 **Read and write permissions**（`ai-build` 需要写 issue、PR 和分支）
- 勾选 **Allow GitHub Actions to create and approve pull requests**

## 第一次上线

1. 确认部署公钥在服务器上（上面第 0 步，已完成）。
2. 配好三个 Secrets。
3. 提交并推送当前改动到 `main`（此时还没开 main 保护）：

   ```powershell
   cd D:\develop\code\web\mainweb
   git add -A
   git commit -m "chore: 加入 AI 自动实现与部署流程"
   git push origin main
   ```

4. 等 `CI` 和 `Deploy` 都绿，打开 `https://www.azraelkaxi.top` 确认没变。
5. 再开启 auto-merge 和 main 保护。

## 日常用法

1. Issues → New issue → 选「功能 / 改动」。
2. 填背景、目标、验收标准、不做什么。
3. 等 AI 回复「需求理解」，看它有没有理解偏。
4. 没问题就回 `/approve`；不想做就回 `/reject`。
5. AI 会开 PR。CI 绿后自动合并，Deploy 自动同步到服务器。
6. 失败时 issue 里会有日志和 `ai:failed` 标签。改需求或修问题后回 `/approve` 重试。
7. 想重新分析：给 issue 加上 `ai:spec` 标签。

## 边界

- AI 不能改 `.github/`、`deploy/`、`backend/`、`package.json`、锁文件、Vite/TS 配置和 `.env*`。
- AI 不能新增依赖。需要新依赖时它会停下来问。
- AI 不能执行 `git push`、`curl`、`ssh`，也不会拿到服务器密钥。推送和部署都由 workflow 做。
- 部署密钥是 `root@43.133.230.43` 的专用 key，工作流只拿它同步 `/www/apps/mainweb/app`，但技术上它仍有 root 权限。要撤销时，删掉服务器 `/root/.ssh/authorized_keys` 里 `github-actions-mainweb` 那一行。想更严格，以后可以换成只对 `app/` 有写权限的 `deploy` 用户 + `rrsync`。
- 机器人只在 `github.repository_owner` 开 issue 或评论时触发，别人开 issue 不会烧你的模型额度。

## 排障

- **AI 没有回复**：看 Actions 里 `AI Spec` 的运行日志；确认 `HAORAN_API_KEY` 已设置。
- **`/approve` 没反应**：确认 issue 上有 `ai:awaiting-approval` 或 `ai:failed` 标签，评论人是仓库所有者。
- **PR 没自动合并**：确认 Allow auto-merge 已开，main 保护规则里有 `build` 检查；`ai-build` 的日志里会写原因。
- **部署失败**：看 `Deploy` 日志；确认 `DEPLOY_SSH_KEY` 是 `.deploy/mainweb_deploy` 的内容，服务器 22 端口可达。
- **想换模型**：改 `.github/ai/opencode.json` 里的 `model`，以及两个 workflow 里的 `--model`。

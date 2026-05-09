---
name: commit-summary
description: Summarize current code changes and optionally commit. Use when the user asks to summarize what changed, record changes, commit with a message, or "总结这次改了什么并提交"/"帮我 commit".
---

# 变更总结与提交 (Commit Summary)

在用户提出「总结这次改了什么」「记录一下变更」「帮我提交」等请求时，按本流程执行：先查看变更、写出总结、可选地执行 commit。

## 何时触发

- 用户说：总结这次改了什么、记录变更、帮我提交、直接 commit、总结并提交
- 用户说：我改完了，帮我写 commit message 并提交

## 流程

### 1) 获取变更范围

在项目根目录执行：

```bash
git status -sb
git diff --stat
git diff
```

若存在已暂存内容，再执行 `git diff --cached` 查看 staged 变更。根据 `git status` 决定总结的是「未暂存」还是「已暂存」的变更。

### 2) 写出总结（中文）

在**当前对话回复**中按下面结构输出本次变更总结即可（**不要**在仓库内新建或修改 `.cursor/commit-summary/` 下的任何总结文档，包括 `YYYY-MM-DD-*.md`、`last-summary.md` 等）。

**回复中建议包含**：

- **涉及文件**：列出主要路径（新增/修改/删除）
- **主要改动**：按模块或功能分点说明
- **一句话概括**：用作 commit message 标题（首行 ≤50 字）

- 总结要基于实际 diff，不要编造。
- 若用户有特殊要求（如按「功能/修复/文档」分类），按用户要求组织。

### 3) 是否执行提交

- **仅总结、不提交**：用户只说「总结」「记录」时，只输出上述总结，不执行 `git add` / `git commit`。可追问：「需要我帮你直接提交吗？」
- **总结并提交**：用户明确说「并提交」「直接 commit」「帮我 commit」时，继续执行步骤 4。

### 4) 执行提交（仅在用户要求提交时）

1. **暂存**：  
   - 若用户未指定文件：`git add -A` 或 `git add .`（按项目习惯）。  
   - 若用户指定了文件或目录：只 `git add` 指定路径。
2. **Commit message**：  
   - 使用总结里的「一句话概括」作为 commit 标题（首行 ≤50 字）。  
   - 若变更较多，可在 commit body 中粘贴「主要改动」列表（`git commit -m "标题" -m "正文"` 或多行 -m）。
3. **执行**：  
   `git commit -m "..."`（或带 -m body），在项目根目录执行。
4. **确认**：提交成功后，简短回复「已提交」并附上本次总结的要点或 commit hash。

## Commit Message 约定（可选）

- 首行：简短说明，不超过 50 字。
- 可选用前缀：`feat:`, `fix:`, `refactor:`, `i18n:`, `chore:` 等，若项目已有规范则遵循项目规范。
- 若项目根目录有 `.cursor/commit-summary/commit-convention.md`，优先按该文件约定生成 message。

## 注意事项

- 不执行 `git push`，除非用户明确说「并 push」或「提交并推送」。
- 提交前若发现存在未跟踪的敏感文件（如 .env、密钥），在总结中提醒用户，并避免将其加入暂存。
- 所有 git 命令在**项目根目录**（即 git 仓库根目录）执行。

## 示例对话

- 用户：「帮我总结这次改了什么并提交」→ 获取 diff → 在对话中写总结 → git add → git commit。
- 用户：「先总结一下我改了啥」→ 获取 diff → 在对话中写总结，不 commit，可问「需要我帮你直接提交吗？」。
- 用户：「记录一下然后 commit」→ 在对话中写总结并执行 commit。

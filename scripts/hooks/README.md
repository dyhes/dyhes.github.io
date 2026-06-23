# Git hooks

仓库内置的 git hooks，集中在 `scripts/hooks/`。

## 启用方式

克隆仓库后，执行一次：

```bash
git config core.hooksPath scripts/hooks
```

此后每次提交都会自动触发钩子。无需额外安装依赖（除了 `node` / `npx`，markdownlint 走 npx 按需拉取）。

## 已配置的钩子

### `pre-commit`

对本次提交 staged 的 `.md` 文件运行 `markdownlint-cli2 --fix`：

- 自动修复 lint 问题（如 MD058 表格空行、自定义规则 `no-bold-in-heading`）
- 修复后的内容自动重新加入 staging
- 若存在无法自动修复的错误，**阻止本次提交**，等用户手动处理

## 跳过钩子

紧急情况下可跳过（请谨慎使用）：

```bash
git commit --no-verify
```

## 修改 / 新增钩子

直接编辑 `scripts/hooks/` 下对应文件，提交即可生效（其他协作者拉到代码后照样自动运行）。

注意：脚本文件必须有可执行权限（`chmod +x scripts/hooks/pre-commit`）。

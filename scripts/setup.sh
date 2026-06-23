#!/usr/bin/env bash
# scripts/setup.sh — 一键初始化本地开发环境
#
# 当前职责：
#   1. 把 git hooksPath 指向 scripts/hooks，启用仓库内置的 git 钩子
#   2. 跑一次环境自检：node / npx 是否可用（markdownlint 走 npx 按需拉取）
#
# 用法：bash scripts/setup.sh

set -e

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [ -z "$REPO_ROOT" ]; then
  echo "❌ 当前目录不是 git 仓库，请先 cd 到项目根目录" >&2
  exit 1
fi

cd "$REPO_ROOT"

echo "[setup] 配置 git hooksPath..."
git config core.hooksPath scripts/hooks
echo "  ✅ core.hooksPath = $(git config --get core.hooksPath)"

echo
echo "[setup] 检查 hook 脚本权限..."
hook_count=0
for f in scripts/hooks/*; do
  if [ -f "$f" ] && [ "$(basename "$f")" != "README.md" ]; then
    chmod +x "$f"
    hook_count=$((hook_count + 1))
  fi
done
echo "  ✅ 已确认 $hook_count 个 hook 脚本可执行"

echo
echo "[setup] 检查 node / npx ..."
if command -v node >/dev/null 2>&1 && command -v npx >/dev/null 2>&1; then
  echo "  ✅ node $(node --version), npx $(npx --version)"
else
  echo "  ⚠️  未检测到 node/npx —— markdownlint 钩子无法工作。"
  echo "      建议安装 Node.js（推荐 LTS）：https://nodejs.org/"
fi

echo
echo "[setup] 检查 hugo ..."
if command -v hugo >/dev/null 2>&1; then
  echo "  ✅ $(hugo version | head -1)"
else
  echo "  ⚠️  未检测到 hugo —— 本地预览/构建不可用。"
  echo "      brew install hugo （需 extended 版本）"
fi

echo
echo "🎉 setup 完成。下一步："
echo "    hugo server       # 启动本地预览"
echo "    git commit ...    # 钩子会在提交前自动跑 markdownlint --fix"

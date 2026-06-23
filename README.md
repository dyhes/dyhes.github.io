# dyhes.github.io

个人博客（[dyhes.github.io](https://dyhes.github.io)）的源码与内容，基于 [Hugo](https://gohugo.io/) + [Hugo Theme Stack](https://github.com/CaiJimmy/hugo-theme-stack) 构建，通过 GitHub Pages 自动部署。

## 目录结构

```
content/post/      所有博文（Markdown）
config/            Hugo 配置
assets/            自定义样式、JS、图片资源
scripts/
├── setup.sh       一键配置本地开发环境
└── hooks/         git 钩子（提交前自动 lint）
markdownlint-rules/
└── no-bold-in-heading.js   自定义 markdownlint 规则
.markdownlint-cli2.cjs      lint 配置入口
```

## 快速开始

```bash
# 1. 克隆后，初始化开发环境（启用 git hooks、自检 node/hugo）
bash scripts/setup.sh

# 2. 本地预览
hugo server
```

## 写作规范

博文统一放在 `content/post/<目录>/<文章名>.md`，frontmatter 模板：

```yaml
---
title: 文章标题
date: 2026-06-22 00:00:00+0000   # 必填，否则 Hugo 渲染为 Jan 01, 0001
categories: [nutrition]
tags: [Computer Network]
---
```

### Markdown 风格约束

仓库通过 `markdownlint-cli2` 强制以下规则：

| 规则 | 说明 | 自动修复 |
|------|------|---------|
| **MD010** | 禁止 hard tab（自动转空格） | ✅ |
| **MD058** | 表格上下必须有空行 | ✅ |
| **no-bold-in-heading**（自定义） | 标题内禁止使用 `**...**` / `__...__` | ✅ |
| **no-fake-ordered-list**（自定义） | 禁止 `**1**` 或 `1 **xxx**`（漏点号）等伪有序列表 | ✅ |
| **no-braille-blank**（自定义） | 禁止用 U+2800 盲文空白当伪空行或行首伪缩进 | ✅ |
| **fix-sublist-indent**（自定义） | 有序列表项下的子列表必须对齐缩进（自动补足） | ✅ |
| **fence-as-inline-code**（自定义） | 检测被误写为 ` ``` ` 围栏的行内 `code`（仅 warn） | ❌（需手动） |
| **no-paragraph-immediately-after-table**（自定义） | 表格后若直接跟普通文本段落，自动补一个空行 | ✅ |
| **fence-inline-sandwich**（自定义） | 句子中夹着的单标识符 fenced code 自动折叠为 inline code | ✅ |

> 自定义规则源码在 [`markdownlint-rules/`](markdownlint-rules/)，配置入口 [`.markdownlint-cli2.cjs`](.markdownlint-cli2.cjs)。

#### 手动检查 / 自动修复

```bash
# 检查全部博文
npx markdownlint-cli2 "content/post/**/*.md"

# 自动修复
npx markdownlint-cli2 --fix "content/post/**/*.md"
```

#### 提交时自动修复

`scripts/setup.sh` 已配置 git `pre-commit` 钩子：

- 提交时自动对 staged 的 `.md` 跑 `markdownlint --fix`
- 自动修复的内容会重新加入本次提交
- 存在无法自动修复的错误时**阻止提交**

如需紧急绕过：`git commit --no-verify`

### 图片防盗链注意事项

- **网易云课堂** (`edu-image.nosdn.127.net`)、**百度** (`RefererWhite` 保护) 等启用 Referer 白名单的图床，必须用 HTML 标签绕过：

  ```html
  <img src="..." referrerpolicy="no-referrer">
  ```

- **知乎图床** (`pic*.zhimg.com`) 无需特殊处理，Markdown 语法即可
- 定期清理失效链接：返回 404 的外部资源、SSL 过期的图床（如 `img.gejiba.com`）、Typora 本地路径（`C:\Users\...`）

## 部署

`master` 分支推送后由 GitHub Actions 自动构建并发布到 GitHub Pages，无需手动操作。

## 主题升级

```bash
hugo mod get -u github.com/CaiJimmy/hugo-theme-stack/v3
hugo mod tidy
```

> 当前锁定 v3 主版本，升级到 v4+ 需要手动修改 `config/module.toml`。

## 附录：原始模板说明

<details>
<summary>Hugo Theme Stack Starter Template (原 README)</summary>

This repository was bootstrapped from [Hugo theme Stack starter template](https://github.com/CaiJimmy/hugo-theme-stack-starter), which uses [Hugo modules](https://gohugo.io/hugo-modules/) to load the theme.

### Deploy to other static hosting

If you want to build this site on Vercel / Netlify etc., make sure Go is available in the build environment.

<details>
<summary>Vercel</summary>

Override build command to install Go manually:

```
amazon-linux-extras install golang1.11 && hugo --gc --minify
```

Set `HUGO_VERSION` env var to the latest Hugo extended version.

</details>

</details>

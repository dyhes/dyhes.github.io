// markdownlint 自定义规则：识别"行内代码被误写成围栏代码块"的反模式。
//
// 触发的反模式（来自某些编辑器/AI 输出错误地把 `xxx` 转换为多行代码块）：
//
//   - **
//     ```
//     @Configuration
//     ```
//     的类约束**：
//
// 渲染结果：加粗被强行拆段，三反引号变成真的代码块，前后段落全乱。
//
// 此规则**只报告**，不自动 fix —— 因为正确修复需要跨多行合并，
// markdownlint 的 fixInfo 接口仅支持单行修改。手动修法：
//
//   - **`@Configuration` 的类约束**：
//
// 即把三连"```/内容/```"塌缩成单个 `内容` 行内代码，再与前后行合并。

"use strict";

const FENCE_NO_LANG = /^(\s*)```\s*$/;
// 上一行只剩"列表前缀 + ** "的近空形态，例如:
//   - **
//   * **
//   1. **
//   > **
const PREV_BARE = /^[\s\-*+>]*\d*\.?\s*\*\*\s*$/;

module.exports = {
  names: ["fence-as-inline-code", "MD-CUSTOM-006"],
  description:
    "Fenced code block used where inline `code` was intended (breaks emphasis)",
  tags: ["code", "emphasis"],
  parser: "none",
  function: function rule(params, onError) {
    const linesArr =
      params.lines ||
      params.contentLines ||
      params.frontMatterLines ||
      (typeof params.content === "string" ? params.content.split("\n") : null);
    if (!linesArr) return;

    for (let i = 1; i + 3 < linesArr.length; i++) {
      const m1 = linesArr[i].match(FENCE_NO_LANG);
      const m3 = linesArr[i + 2].match(FENCE_NO_LANG);
      if (!m1 || !m3) continue;
      if (m1[1] !== m3[1]) continue;
      const prev = linesArr[i - 1];
      const next = linesArr[i + 3];
      if (!PREV_BARE.test(prev)) continue;
      if (!next || !next.includes("**")) continue;

      const contentLine = linesArr[i + 1];
      const indent = m1[1];
      const content = contentLine.startsWith(indent)
        ? contentLine.slice(indent.length)
        : contentLine;
      if (!content.trim()) continue;
      if (content.includes("`") || content.includes("**")) continue;

      onError({
        lineNumber: i + 1,
        detail:
          "Fenced ``` likely meant to be inline `code`. " +
          "Manual fix: collapse 3 lines into single `code` span and merge with surrounding **bold**.",
        context: `${prev.trim()} / ${content.trim()} / ${next.trim().slice(0, 40)}`,
      });
    }
  },
};

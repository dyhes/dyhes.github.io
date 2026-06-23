// markdownlint 自定义规则：禁止标题内使用加粗（** 或 __）
// 支持 --fix：会自动剥掉标题中的强调标记，保留内部文本。
//
// 说明：
// - 仅作用于 ATX 标题（`#` 开头）和 Setext 标题（=== / --- 下划线式）
// - 不修改代码块、引用块等其他位置的加粗
// - 通过 markdownlint 提供的 token 与 fix 接口实现，无需自行解析围栏

"use strict";

const STRONG_RE = /(\*\*|__)([\s\S]+?)\1/g;

module.exports = {
  names: ["no-bold-in-heading", "MD-CUSTOM-001"],
  description: "Headings should not contain bold (**) emphasis",
  tags: ["headings", "style"],
  parser: "markdownit",
  function: function rule(params, onError) {
    // 新版 markdownlint：tokens 通过 params.parsers.markdownit.tokens 提供
    const tokens =
      (params.parsers &&
        params.parsers.markdownit &&
        params.parsers.markdownit.tokens) ||
      params.tokens ||
      [];
    for (let i = 0; i < tokens.length; i++) {
      const tok = tokens[i];
      if (tok.type !== "heading_open") continue;
      const inline = tokens[i + 1];
      if (!inline || inline.type !== "inline") continue;

      const hasStrong = (inline.children || []).some(
        (c) => c.type === "strong_open"
      );
      if (!hasStrong) continue;

      const lineNumber = tok.lineNumber;
      const linesArr =
        params.lines ||
        params.contentLines ||
        params.frontMatterLines ||
        (typeof params.content === "string" ? params.content.split("\n") : null);
      if (!linesArr) continue;
      const originalLine = linesArr[lineNumber - 1];
      if (originalLine === undefined || originalLine === null) continue;

      const atxMatch = originalLine.match(/^(\s{0,3}#{1,6}\s+)([\s\S]*?)(\s*)$/);
      let fixedLine;
      if (atxMatch) {
        let body = atxMatch[2].replace(STRONG_RE, (_, _marker, inner) => inner);
        body = body.replace(/  +/g, " ").trim();
        fixedLine = atxMatch[1] + body + atxMatch[3];
      } else {
        let body = originalLine.replace(STRONG_RE, (_, _marker, inner) => inner);
        body = body.replace(/  +/g, " ").trimEnd();
        fixedLine = body;
      }

      if (fixedLine === originalLine) continue;

      onError({
        lineNumber,
        detail: "Remove ** / __ from heading text",
        context:
          originalLine.length > 80
            ? originalLine.slice(0, 80) + "…"
            : originalLine,
        fixInfo: {
          lineNumber,
          editColumn: 1,
          deleteCount: originalLine.length,
          insertText: fixedLine,
        },
      });
    }
  },
};

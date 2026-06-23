// markdownlint 自定义规则：识别两种"伪有序列表"，自动改成合法的 "N." 形式。
//
// 触发例 A（粗体编号）：
//   **1** **作用域限制** ：xxx
//   **2** **资源开销**
//
// 触发例 B（裸数字 + 空格 + 加粗，漏了点号）：
//   2 **__syncwarp() 的适用场景** ：xxx
//
// 修复后：
//   1. **作用域限制** ：xxx
//   2. **__syncwarp() 的适用场景** ：xxx
//
// 注意：
//   - 仅当下文紧跟 ** 开头时，B 形态才视为"伪编号"。
//     纯文本如 "2025 年" 不会被误判。
//   - A 形态对 ** 包裹的数字直接识别。

"use strict";

// 形态 A：**12** + 空格 + 内容
const FAKE_OL_A = /^(\s{0,3})\*\*(\d+)\*\*\s+(.*)$/;
// 形态 B：数字 + 空格 + ** (加粗开头)，并且数字与 ** 之间没有 "."
//   - 必须开头紧接 ** 才算，避免误改正文（如 "1 GB"、"2025 年"）
const FAKE_OL_B = /^(\s{0,3})(\d+)\s+(\*\*[\s\S]*)$/;

module.exports = {
  names: ["no-fake-ordered-list", "MD-CUSTOM-002"],
  description:
    'Avoid pseudo numbered list ("**N**" or "N "); use real "N." instead',
  tags: ["lists", "style"],
  parser: "none",
  function: function rule(params, onError) {
    const linesArr =
      params.lines ||
      params.contentLines ||
      params.frontMatterLines ||
      (typeof params.content === "string" ? params.content.split("\n") : null);
    if (!linesArr) return;

    let inFence = false;
    for (let idx = 0; idx < linesArr.length; idx++) {
      const line = linesArr[idx];
      const trimmed = line.replace(/^[ \t]+/, "");
      if (/^(```+|~~~+)/.test(trimmed)) {
        inFence = !inFence;
        continue;
      }
      if (inFence) continue;

      let indent;
      let num;
      let rest;
      let kind;
      const ma = line.match(FAKE_OL_A);
      const mb = !ma && line.match(FAKE_OL_B);
      if (ma) {
        indent = ma[1];
        num = ma[2];
        rest = ma[3].replace(/^\s+/, "");
        kind = `**${num}**`;
      } else if (mb) {
        indent = mb[1];
        num = mb[2];
        rest = mb[3];
        kind = `${num} `;
      } else {
        continue;
      }

      const fixed = `${indent}${num}. ${rest}`;
      onError({
        lineNumber: idx + 1,
        detail: `Replace "${kind}" with "${num}."`,
        context: line.length > 80 ? line.slice(0, 80) + "…" : line,
        fixInfo: {
          lineNumber: idx + 1,
          editColumn: 1,
          deleteCount: line.length,
          insertText: fixed,
        },
      });
    }
  },
};

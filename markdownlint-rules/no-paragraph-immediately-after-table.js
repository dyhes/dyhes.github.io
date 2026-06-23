// markdownlint 自定义规则：检测 GFM 表格结束后直接跟普通文本段落的情况。
//
// 背景：
// - 内置 MD058 不会处理"表格后紧跟普通文本"这一类情况，
//   因为解析器会把它视作 table block 的连续内容。
// - 但在 Hugo / Goldmark 渲染里，这通常会让原本想写的新段落
//   看起来像是"被表格吞掉了"，可读性也明显变差。
//
// 例：
// | A | B |
// | - | - |
// | 1 | 2 |
// **示例代码**：
//
// 应改为：
// | A | B |
// | - | - |
// | 1 | 2 |
//
// **示例代码**：
//
// 修复策略：
// - 仅识别标准 pipe table（表头 + 分隔线 + 0..N 行数据）
// - 表格末行的下一行若是"普通文本段落起始"，则报错
// - 自动修复：在该行前插入一个空行

"use strict";

const FENCE_RE = /^\s{0,3}(```+|~~~+)/;
const TABLE_DELIMITER_RE =
  /^\s{0,3}\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/;
const TABLE_ROW_RE = /^\s{0,3}\|?.*\|.*\|?\s*$/;
const THEMATIC_BREAK_RE = /^\s{0,3}(?:\*\s*){3,}$|^\s{0,3}(?:-\s*){3,}$|^\s{0,3}(?:_\s*){3,}$/;
const LIST_MARKER_RE = /^\s{0,3}(?:[*+-]\s+|\d+[.)]\s+)/;

function isTableStart(linesArr, index) {
  if (index + 1 >= linesArr.length) return false;
  return (
    TABLE_ROW_RE.test(linesArr[index]) && TABLE_DELIMITER_RE.test(linesArr[index + 1])
  );
}

function isTableRow(line) {
  return TABLE_ROW_RE.test(line);
}

function isParagraphLike(line) {
  const trimmed = line.trim();
  if (!trimmed) return false;
  if (/^\s{4,}/.test(line) || /^\t/.test(line)) return false;
  if (FENCE_RE.test(line)) return false;
  if (/^\s{0,3}>/.test(line)) return false;
  if (/^\s{0,3}#/.test(line)) return false;
  if (LIST_MARKER_RE.test(line)) return false;
  if (THEMATIC_BREAK_RE.test(line)) return false;
  if (isTableRow(line)) return false;
  return true;
}

module.exports = {
  names: ["no-paragraph-immediately-after-table", "MD-CUSTOM-007"],
  description: "Tables must be followed by a blank line before a normal paragraph",
  tags: ["tables", "paragraphs", "spacing"],
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
      if (FENCE_RE.test(line)) {
        inFence = !inFence;
        continue;
      }
      if (inFence) continue;
      if (!isTableStart(linesArr, idx)) continue;

      let tableEnd = idx + 1;
      while (tableEnd + 1 < linesArr.length && isTableRow(linesArr[tableEnd + 1])) {
        tableEnd++;
      }

      const nextIndex = tableEnd + 1;
      if (nextIndex >= linesArr.length) {
        idx = tableEnd;
        continue;
      }

      const nextLine = linesArr[nextIndex];
      if (!isParagraphLike(nextLine)) {
        idx = tableEnd;
        continue;
      }

      onError({
        lineNumber: nextIndex + 1,
        detail: "Insert a blank line between the table and the following paragraph",
        context:
          nextLine.length > 80 ? nextLine.slice(0, 80) + "..." : nextLine,
        fixInfo: {
          lineNumber: nextIndex + 1,
          editColumn: 1,
          deleteCount: 0,
          insertText: "\n",
        },
      });

      idx = tableEnd;
    }
  },
};

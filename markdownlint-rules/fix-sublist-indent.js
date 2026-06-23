// markdownlint 自定义规则：修复有序列表项下"子无序列表缩进不足"的常见 AI 输出。
//
// 触发例（直接接在 "N. ..." 后面，子项只有 1 个前导空格）：
//   1. **优先 Cooperative Groups 的场景** ：
//    * 需要安全同步
//    * 需集体操作
//   2. **__syncwarp() 的适用场景** ：
//    * 对旧架构...
//
// CommonMark 要求子列表缩进对齐到父项内容起点（"1. " 后即第 4 列），
// 1 个空格不足 → 子项会被解析成"独立无序列表"，渲染失去层级。
//
// 修复策略：保守地补足。仅处理：
//   - 当前行: "^ * " (单空格 + * + 空格 + 文字)
//   - 在它之前最近的非空行属于有序列表项 "^N. "
//   该子项与同段内紧邻的连续单空格子项一起被改成正确缩进
//
// 这条规则不能覆盖所有缩进错乱情况，只处理 AI 输出最常见的形态，
// 复杂情况保留给人工。

"use strict";

const ORDERED_LIST = /^(\d+)\.\s+\S/;
const SINGLE_SPACE_BULLET = /^ ([*+\-])\s+/;

module.exports = {
  names: ["fix-sublist-indent", "MD-CUSTOM-005"],
  description: "Sub-list under ordered list item must be indented to align",
  tags: ["lists", "indentation"],
  parser: "none",
  function: function rule(params, onError) {
    const linesArr =
      params.lines ||
      params.contentLines ||
      params.frontMatterLines ||
      (typeof params.content === "string" ? params.content.split("\n") : null);
    if (!linesArr) return;

    let inFence = false;
    let parentOrderedNumLen = 0; // "1. " 长度 = 1+2=3；"10. " = 2+2=4
    for (let idx = 0; idx < linesArr.length; idx++) {
      const line = linesArr[idx];
      const lstripped = line.replace(/^[ \t]+/, "");
      if (/^(```+|~~~+)/.test(lstripped)) {
        inFence = !inFence;
        parentOrderedNumLen = 0;
        continue;
      }
      if (inFence) continue;

      // 父项 = 顶层有序列表项（左对齐）
      const olMatch = line.match(ORDERED_LIST);
      if (olMatch) {
        parentOrderedNumLen = olMatch[1].length + 2; // 数字位数 + ". "
        continue;
      }

      // 空行：保留父项状态（CommonMark 允许列表项内有空行）
      if (line.trim() === "") continue;

      // 不在"父有序项之后" → 不触发
      if (parentOrderedNumLen === 0) continue;

      // 仅修复单空格 + bullet 这种最常见错位
      const subMatch = line.match(SINGLE_SPACE_BULLET);
      if (!subMatch) {
        // 如果遇到非子项且非空非空行，结束父级跟踪
        if (!/^\s/.test(line)) parentOrderedNumLen = 0;
        continue;
      }

      const needIndent = " ".repeat(parentOrderedNumLen);
      const fixed = needIndent + line.slice(1); // 把开头单空格换成对齐缩进

      onError({
        lineNumber: idx + 1,
        detail: `Indent sub-list bullet to align under parent (need ${parentOrderedNumLen} spaces)`,
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

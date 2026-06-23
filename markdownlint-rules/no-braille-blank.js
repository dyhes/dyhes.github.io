// markdownlint 自定义规则：检测两种 U+2800（盲文空白）滥用：
//   1) 整行只有 ⠀          → 替换为真正的空行
//   2) 行首带 ⠀ + 其他内容  → 删掉行首的 ⠀（这种通常是 AI 在段首伪造"缩进"）
//
// 例：
//   ⠀                          → ""
//   ⠀**迁移建议** ：xxx        → "**迁移建议** ：xxx"

"use strict";

const BRAILLE_BLANK = "\u2800";
const ONLY_BRAILLE = new RegExp(
  `^[\\s${BRAILLE_BLANK}]*${BRAILLE_BLANK}[\\s${BRAILLE_BLANK}]*$`
);
const LEADING_BRAILLE = new RegExp(`^[${BRAILLE_BLANK}]+`);

module.exports = {
  names: ["no-braille-blank", "MD-CUSTOM-003"],
  description: "Avoid using U+2800 (braille blank) as fake empty/indent",
  tags: ["whitespace", "style"],
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

      // 情况 1：整行只有盲文空白
      if (ONLY_BRAILLE.test(line)) {
        onError({
          lineNumber: idx + 1,
          detail: "Line contains only U+2800; replace with real empty line",
          context: JSON.stringify(line),
          fixInfo: {
            lineNumber: idx + 1,
            editColumn: 1,
            deleteCount: line.length,
            insertText: "",
          },
        });
        continue;
      }

      // 情况 2：行首有一或多个 ⠀ 且后面紧跟其他内容
      if (LEADING_BRAILLE.test(line)) {
        const stripped = line.replace(LEADING_BRAILLE, "");
        onError({
          lineNumber: idx + 1,
          detail: "Strip leading U+2800 from line",
          context: JSON.stringify(line.slice(0, 40)),
          fixInfo: {
            lineNumber: idx + 1,
            editColumn: 1,
            deleteCount: line.length,
            insertText: stripped,
          },
        });
      }
    }
  },
};

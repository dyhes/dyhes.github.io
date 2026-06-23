// markdownlint-cli2 配置（CommonJS 形态，方便加载自定义规则）
//
// 启用的规则：
//   - MD010                 禁止 hard tab（自带 --fix，会转成空格）
//   - MD022                 标题前后需空行
//   - MD031                 代码围栏前后需空行
//   - MD032                 列表前后需空行
//   - MD058                 表格上下需有空行
//   - no-bold-in-heading    标题内禁止 ** 加粗
//   - no-fake-ordered-list  禁止 **N** / "N " 形式的伪有序列表
//   - no-braille-blank      禁止用 U+2800 当伪空行
//   - fix-sublist-indent    有序列表项下的子列表必须对齐缩进
//   - fence-as-inline-code  围栏代码块被误用为行内 `code`（仅 warn，需手动修）
//   - no-paragraph-immediately-after-table
//                          表格后若直接跟普通文本段落，要求补空行

const noBoldInHeading = require("./markdownlint-rules/no-bold-in-heading.js");
const noFakeOrderedList = require("./markdownlint-rules/no-fake-ordered-list.js");
const noBrailleBlank = require("./markdownlint-rules/no-braille-blank.js");
const fixSublistIndent = require("./markdownlint-rules/fix-sublist-indent.js");
const fenceAsInlineCode = require("./markdownlint-rules/fence-as-inline-code.js");
const noParagraphImmediatelyAfterTable = require("./markdownlint-rules/no-paragraph-immediately-after-table.js");

module.exports = {
  config: {
    default: false,
    MD010: true,
    MD022: true,
    MD031: true,
    MD032: true,
    MD058: true,
    "no-bold-in-heading": true,
    "no-fake-ordered-list": true,
    "no-braille-blank": true,
    "fix-sublist-indent": true,
    "fence-as-inline-code": true,
    "no-paragraph-immediately-after-table": true,
  },
  customRules: [
    noBoldInHeading,
    noFakeOrderedList,
    noBrailleBlank,
    fixSublistIndent,
    fenceAsInlineCode,
    noParagraphImmediatelyAfterTable,
  ],
};

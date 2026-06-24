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
//   - fence-inline-sandwich 句子中夹着的单标识符 fenced code 自动塌缩为 inline
//   - fence-indent-alignment 围栏代码块 opening/closing fence 缩进必须一致
//
// 已移除：
//   - fence-closing-indent-too-deep
//     该规则想修"closing fence 缩进 >=4 失效"，但按 CommonMark，失效的 closing 会被
//     解析为代码内容，与"列表内合法 fence（indent>=4，按列表基线 dedent 后 <=3）"在
//     文本和 token 层面均不可区分；markdownlint(markdown-it) 与渲染器(Goldmark)对列表
//     内 fence 的解析还存在差异。自动 --fix 会大面积误改列表内合法 fence（实测会破坏
//     docker.md 等）。真正的"代码块未闭合"应通过渲染检查发现，而非此规则。

const noBoldInHeading = require("./markdownlint-rules/no-bold-in-heading.js");
const noFakeOrderedList = require("./markdownlint-rules/no-fake-ordered-list.js");
const noBrailleBlank = require("./markdownlint-rules/no-braille-blank.js");
const fixSublistIndent = require("./markdownlint-rules/fix-sublist-indent.js");
const fenceAsInlineCode = require("./markdownlint-rules/fence-as-inline-code.js");
const noParagraphImmediatelyAfterTable = require("./markdownlint-rules/no-paragraph-immediately-after-table.js");
const fenceInlineSandwich = require("./markdownlint-rules/fence-inline-sandwich.js");
const fenceIndentAlignment = require("./markdownlint-rules/fence-indent-alignment.js");

module.exports = {
  config: {
    default: false,
    MD010: true,
    MD022: true,
    MD031: true,
    MD032: true,
    MD058: true,
    "no-bold-in-heading": false,
    "no-fake-ordered-list": false,
    "no-braille-blank": false,
    "fix-sublist-indent": false,
    "fence-as-inline-code": false,
    "no-paragraph-immediately-after-table": false,
    "fence-inline-sandwich": false,
    "fence-indent-alignment": false,
  },
  customRules: [
    noBoldInHeading,
    noFakeOrderedList,
    noBrailleBlank,
    fixSublistIndent,
    fenceAsInlineCode,
    noParagraphImmediatelyAfterTable,
    fenceInlineSandwich,
    fenceIndentAlignment,
  ],
};

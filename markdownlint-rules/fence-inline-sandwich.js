// markdownlint 自定义规则：把"句子中间误写成 fenced code 的单标识符"改回 inline code。
//
// 典型反模式：
//   - Redis 示例：通过
//
//   ```
//     RedisCacheManager
//   ```
//
//   为不同分区指定过期时间。
//
// 目标修复：
//   - Redis 示例：通过 `RedisCacheManager` 为不同分区指定过期时间。
//
// 只处理"安全单标识符"场景：
// - 无语言标签的三反引号
// - 中间只有一行内容
// - 内容不含空格，且仅由常见 API / 注解 / 调用符号组成
// - 前后都是普通文本行，中间夹着一段 fenced code

"use strict";

const FENCE_NO_LANG = /^(\s*)```\s*$/;
const SAFE_INLINE_RE = /^[@A-Za-z_][@A-Za-z0-9_.$:*<>\-()[\],/'"]*$/;
const LIST_ITEM_RE = /^\s{0,3}(?:[*+-]|\d+[.)])\s+/;
const ENUM_SEPARATOR_RE = /^\s*[,，、]\s*$/;
const HEADING_RE = /^\s{0,3}#{1,6}(?:\s|$)/;
const QUOTE_RE = /^\s{0,3}>/;
const TABLE_RE = /^\s*\|.*\|\s*$/;
const THEMATIC_BREAK_RE = /^\s{0,3}(?:[-*_]\s*){3,}$/;
const HTML_BLOCK_RE = /^\s{0,3}<[/!A-Za-z][^>]*>/;
const LIST_PREFIX_RE = /^(\s{0,3})(?:[*+-]|\d+[.)])\s+/;
const TAIL_NO_SPACE_RE = /^[,.;:!?)}\]，。、；：！？）】》]/;

function isTextLine(line) {
  if (!line || !line.trim()) return false;
  if (/^\s{4,}/.test(line) || /^\t/.test(line)) return false;
  if (/^\s{0,3}(?:```|~~~)/.test(line)) return false;
  if (/^\s{0,3}#/.test(line)) return false;
  if (/^\s{0,3}>/.test(line)) return false;
  return true;
}

function isListItemStart(line) {
  return LIST_ITEM_RE.test(line || "");
}

function isIndentedContinuationLine(prev, tail) {
  if (!prev || !tail || !tail.trim()) return false;
  const prevMatch = prev.match(LIST_PREFIX_RE);
  if (!prevMatch) return false;

  const indentMatch = tail.match(/^(\s+)/);
  if (!indentMatch) return false;

  const continuationIndent = indentMatch[1].length;
  const listIndent = prevMatch[1].length;
  const trimmedTail = tail.trimStart();

  if (continuationIndent < listIndent + 2) return false;
  if (
    HEADING_RE.test(trimmedTail) ||
    QUOTE_RE.test(trimmedTail) ||
    TABLE_RE.test(trimmedTail) ||
    THEMATIC_BREAK_RE.test(trimmedTail) ||
    HTML_BLOCK_RE.test(trimmedTail) ||
    /^\s{0,3}(?:```|~~~)/.test(trimmedTail) ||
    /^\t/.test(trimmedTail) ||
    isListItemStart(trimmedTail)
  ) {
    return false;
  }

  return true;
}

function isBlockStructureStart(line) {
  if (!line || !line.trim()) return false;
  return (
    HEADING_RE.test(line) ||
    QUOTE_RE.test(line) ||
    TABLE_RE.test(line) ||
    THEMATIC_BREAK_RE.test(line) ||
    HTML_BLOCK_RE.test(line) ||
    /^\s{0,3}(?:```|~~~)/.test(line) ||
    /^\s{4,}/.test(line) ||
    /^\t/.test(line)
  );
}

function parseEnumerationChain(linesArr, startIndex) {
  const prev = linesArr[startIndex];
  if (!isTextLine(prev)) return null;
  if (linesArr[startIndex + 1]?.trim() !== "") return null;

  let cursor = startIndex + 1;
  const tokens = [];

  while (true) {
    const separator = linesArr[cursor + 1];
    const blankAfterSeparator = linesArr[cursor + 2];
    const open = linesArr[cursor + 3];
    const middle = linesArr[cursor + 4];
    const close = linesArr[cursor + 5];
    const blankAfterFence = linesArr[cursor + 6];

    if (
      !separator ||
      !ENUM_SEPARATOR_RE.test(separator) ||
      blankAfterSeparator === undefined ||
      blankAfterSeparator.trim() !== "" ||
      !open ||
      !middle ||
      !close ||
      blankAfterFence === undefined ||
      blankAfterFence.trim() !== ""
    ) {
      return null;
    }

    const openMatch = open.match(FENCE_NO_LANG);
    const closeMatch = close.match(FENCE_NO_LANG);
    if (!openMatch || !closeMatch || openMatch[1] !== closeMatch[1]) {
      return null;
    }

    const indent = openMatch[1];
    const content = middle.startsWith(indent)
      ? middle.slice(indent.length).trim()
      : middle.trim();
    if (!content || !SAFE_INLINE_RE.test(content)) {
      return null;
    }

    tokens.push({ separator: separator.trim(), content });
    cursor += 6;

    if (!ENUM_SEPARATOR_RE.test(linesArr[cursor + 1] || "")) {
      break;
    }
  }

  const tail = linesArr[cursor + 1];
  const tailIsContinuation = isIndentedContinuationLine(prev, tail);
  if (
    !tail ||
    !tail.trim() ||
    ((!tailIsContinuation && isBlockStructureStart(tail)) || isListItemStart(tail))
  ) {
    return null;
  }

  let merged = prev.replace(/\s+$/, "");
  for (const token of tokens) {
    merged = `${merged}${token.separator} \`${token.content}\``;
  }
  merged = appendTail(merged, tail);

  return {
    merged,
    context: `${prev.trim()} / ${tokens.map((t) => t.content).join(" / ")} / ${tail.trim()}`,
    deleteFrom: startIndex + 1,
    deleteTo: cursor + 1,
    endIndex: cursor + 1,
  };
}

function appendInline(prev, content) {
  const left = prev.replace(/\s+$/, "");
  const sepLeft = left ? " " : "";
  return `${left}${sepLeft}\`${content}\``;
}

function appendTail(base, tail) {
  const right = tail.replace(/^\s+/, "");
  const sepRight = right && !TAIL_NO_SPACE_RE.test(right) ? " " : "";
  return `${base}${sepRight}${right}`;
}

function joinInline(prev, content, next) {
  const left = prev.replace(/\s+$/, "");
  const right = next.replace(/^\s+/, "");
  const sepLeft = left ? " " : "";
  const sepRight = right && !TAIL_NO_SPACE_RE.test(right) ? " " : "";
  return `${left}${sepLeft}\`${content}\`${sepRight}${right}`;
}

module.exports = {
  names: ["fence-inline-sandwich", "MD-CUSTOM-008"],
  description:
    "Fenced code block used for a single inline identifier between text fragments",
  tags: ["code", "inline", "formatting"],
  parser: "none",
  function: function rule(params, onError) {
    const linesArr =
      params.lines ||
      params.contentLines ||
      params.frontMatterLines ||
      (typeof params.content === "string" ? params.content.split("\n") : null);
    if (!linesArr) return;

    for (let i = 0; i + 6 < linesArr.length; i++) {
      const enumeration = parseEnumerationChain(linesArr, i);
      if (enumeration) {
        onError({
          lineNumber: i + 1,
          detail:
            "Collapse comma-separated fenced identifiers into inline `code` enumeration",
          context: enumeration.context,
          fixInfo: {
            lineNumber: i + 1,
            editColumn: 1,
            deleteCount: linesArr[i].length,
            insertText: enumeration.merged,
          },
        });

        for (
          let lineToDelete = enumeration.deleteFrom;
          lineToDelete <= enumeration.deleteTo;
          lineToDelete++
        ) {
          onError({
            lineNumber: i + 1,
            detail: "Auto-fix helper: remove lines consumed by enumeration collapse",
            fixInfo: {
              lineNumber: lineToDelete + 1,
              deleteCount: -1,
            },
          });
        }

        i = enumeration.endIndex;
        continue;
      }

      const prev = linesArr[i];
      const blank1 = linesArr[i + 1];
      const open = linesArr[i + 2];
      const middle = linesArr[i + 3];
      const close = linesArr[i + 4];
      const blank2 = linesArr[i + 5];
      const next = linesArr[i + 6];

      if (!isTextLine(prev)) continue;
      if (!next || !next.trim()) continue;
      if (blank1.trim() !== "" || blank2.trim() !== "") continue;

      const openMatch = open.match(FENCE_NO_LANG);
      const closeMatch = close.match(FENCE_NO_LANG);
      if (!openMatch || !closeMatch) continue;
      if (openMatch[1] !== closeMatch[1]) continue;

      const indent = openMatch[1];
      const content = middle.startsWith(indent)
        ? middle.slice(indent.length).trim()
        : middle.trim();
      if (!content || !SAFE_INLINE_RE.test(content)) continue;

      const nextIsListItem = isListItemStart(next);
      const nextIsBlockStructure = isBlockStructureStart(next);
      const merged = nextIsListItem || nextIsBlockStructure
        ? appendInline(prev, content)
        : joinInline(prev, content, next);
      onError({
        lineNumber: i + 1,
        detail:
          "Collapse fenced single-line identifier into inline `code` within the sentence",
        context: `${prev.trim()} / ${content} / ${next.trim()}`,
        fixInfo: {
          lineNumber: i + 1,
          editColumn: 1,
          deleteCount: prev.length,
          insertText: merged,
        },
      });

      const deleteStart = i + 1;
      const deleteEnd = nextIsBlockStructure ? i + 4 : nextIsListItem ? i + 5 : i + 6;
      for (let lineToDelete = deleteStart; lineToDelete <= deleteEnd; lineToDelete++) {
        onError({
          lineNumber: i + 1,
          detail: "Auto-fix helper: remove lines consumed by inline-code collapse",
          fixInfo: {
            lineNumber: lineToDelete + 1,
            deleteCount: -1,
          },
        });
      }

      i += 6;
    }
  },
};

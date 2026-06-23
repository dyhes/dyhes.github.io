"use strict";

const OPEN_FENCE_RE = /^(\s{0,3})(`{3,}|~{3,})([^`]*)$/;

module.exports = {
  names: ["fence-indent-alignment", "MD-CUSTOM-009"],
  description: "Opening and closing fenced code blocks must use the same indentation",
  tags: ["code", "fence", "indentation"],
  parser: "none",
  function: function rule(params, onError) {
    const linesArr =
      params.lines ||
      params.contentLines ||
      params.frontMatterLines ||
      (typeof params.content === "string" ? params.content.split("\n") : null);
    if (!linesArr) return;

    const stack = [];

    linesArr.forEach((line, index) => {
      const match = line.match(OPEN_FENCE_RE);
      if (!match) return;

      const indent = match[1];
      const marker = match[2];
      const tail = match[3] || "";
      const markerChar = marker[0];
      const markerLength = marker.length;

      const closingRe = new RegExp(
        `^(\\s{0,3})(${markerChar}{${markerLength},})[ \\t]*$`
      );
      const closingMatch = line.match(closingRe);

      if (stack.length) {
        const top = stack[stack.length - 1];
        if (
          closingMatch &&
          top.markerChar === markerChar &&
          marker.length >= top.markerLength
        ) {
          stack.pop();
          if (indent !== top.indent) {
            onError({
              lineNumber: index + 1,
              detail:
                "Closing fence indentation must match the opening fence indentation",
              context: `${top.line.trim()} / ${line.trim()}`,
              fixInfo: {
                lineNumber: index + 1,
                editColumn: 1,
                deleteCount: line.length,
                insertText: `${top.indent}${marker}${tail.replace(/[ \t]*$/, "")}`,
              },
            });
          }
          return;
        }
      }

      if (!/[`~]/.test(tail.trimStart().charAt(0))) {
        stack.push({
          indent,
          markerChar,
          markerLength,
          line,
        });
      }
    });
  },
};

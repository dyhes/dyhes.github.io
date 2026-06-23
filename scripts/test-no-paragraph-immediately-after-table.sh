#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
FIXTURE_DIR="$ROOT_DIR/tests/markdownlint/no-paragraph-immediately-after-table"
BAD_FIXTURE="$FIXTURE_DIR/bad.md"
GOOD_FIXTURE="$FIXTURE_DIR/good.md"
EXPECTED_FIXED="$FIXTURE_DIR/expected-fixed.md"

TMP_BAD="$(mktemp /tmp/no-paragraph-after-table-bad-XXXXXX.md)"
TMP_OUT="$(mktemp /tmp/no-paragraph-after-table-out-XXXXXX.txt)"
cleanup() {
  rm -f "$TMP_BAD" "$TMP_OUT"
}
trap cleanup EXIT

cd "$ROOT_DIR"
cp "$BAD_FIXTURE" "$TMP_BAD"

if npx --yes markdownlint-cli2 "$TMP_BAD" >"$TMP_OUT" 2>&1; then
  echo "expected bad fixture to fail lint, but it passed"
  exit 1
fi

if ! grep -q "no-paragraph-immediately-after-table" "$TMP_OUT"; then
  echo "expected lint output to mention no-paragraph-immediately-after-table"
  cat "$TMP_OUT"
  exit 1
fi

npx --yes markdownlint-cli2 --fix "$TMP_BAD" >/dev/null
diff -u "$EXPECTED_FIXED" "$TMP_BAD"
npx --yes markdownlint-cli2 "$TMP_BAD" >/dev/null
npx --yes markdownlint-cli2 "$GOOD_FIXTURE" >/dev/null

echo "test-no-paragraph-immediately-after-table: PASS"

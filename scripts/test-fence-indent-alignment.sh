#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
FIXTURE_DIR="$ROOT_DIR/tests/markdownlint/fence-indent-alignment"
TMP_OUT="$(mktemp /tmp/fence-indent-alignment-out-XXXXXX.txt)"
cleanup() {
  rm -f "$TMP_OUT"
}
trap cleanup EXIT

cd "$ROOT_DIR"
tmp_bad="$(mktemp /tmp/fence-indent-alignment-XXXXXX)"
cp "$FIXTURE_DIR/bad.md" "$tmp_bad"

if npx --yes markdownlint-cli2 "$tmp_bad" >"$TMP_OUT" 2>&1; then
  echo "expected bad fixture to fail lint, but it passed"
  rm -f "$tmp_bad"
  exit 1
fi

if ! grep -q "fence-indent-alignment" "$TMP_OUT"; then
  echo "expected lint output to mention fence-indent-alignment"
  cat "$TMP_OUT"
  rm -f "$tmp_bad"
  exit 1
fi

npx --yes markdownlint-cli2 --fix "$tmp_bad" >/dev/null
diff -u "$FIXTURE_DIR/expected-fixed.md" "$tmp_bad"
npx --yes markdownlint-cli2 "$tmp_bad" >/dev/null
npx --yes markdownlint-cli2 "$FIXTURE_DIR/good.md" >/dev/null
rm -f "$tmp_bad"

echo "test-fence-indent-alignment: PASS"

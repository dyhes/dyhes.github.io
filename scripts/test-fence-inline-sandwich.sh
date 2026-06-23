#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
FIXTURE_DIR="$ROOT_DIR/tests/markdownlint/fence-inline-sandwich"
TMP_OUT="$(mktemp /tmp/fence-inline-sandwich-out-XXXXXX.txt)"
cleanup() {
  rm -f "$TMP_OUT"
}
trap cleanup EXIT

cd "$ROOT_DIR"
run_case() {
  local base="$1"
  local bad_fixture="$FIXTURE_DIR/${base}-bad.md"
  local expected_fixed="$FIXTURE_DIR/${base}-expected-fixed.md"
  local tmp_bad
  tmp_bad="$(mktemp /tmp/fence-inline-sandwich-XXXXXX)"
  cp "$bad_fixture" "$tmp_bad"

  if npx --yes markdownlint-cli2 "$tmp_bad" >"$TMP_OUT" 2>&1; then
    echo "expected bad fixture to fail lint, but it passed: $base"
    rm -f "$tmp_bad"
    exit 1
  fi

  if ! grep -q "fence-inline-sandwich" "$TMP_OUT"; then
    echo "expected lint output to mention fence-inline-sandwich: $base"
    cat "$TMP_OUT"
    rm -f "$tmp_bad"
    exit 1
  fi

  npx --yes markdownlint-cli2 --fix "$tmp_bad" >/dev/null
  diff -u "$expected_fixed" "$tmp_bad"
  npx --yes markdownlint-cli2 "$tmp_bad" >/dev/null
  rm -f "$tmp_bad"
}

run_case_files() {
  local bad_fixture="$1"
  local expected_fixed="$2"
  local tmp_bad
  tmp_bad="$(mktemp /tmp/fence-inline-sandwich-XXXXXX)"
  cp "$bad_fixture" "$tmp_bad"

  if npx --yes markdownlint-cli2 "$tmp_bad" >"$TMP_OUT" 2>&1; then
    echo "expected bad fixture to fail lint, but it passed: $bad_fixture"
    rm -f "$tmp_bad"
    exit 1
  fi

  if ! grep -q "fence-inline-sandwich" "$TMP_OUT"; then
    echo "expected lint output to mention fence-inline-sandwich: $bad_fixture"
    cat "$TMP_OUT"
    rm -f "$tmp_bad"
    exit 1
  fi

  npx --yes markdownlint-cli2 --fix "$tmp_bad" >/dev/null
  diff -u "$expected_fixed" "$tmp_bad"
  npx --yes markdownlint-cli2 "$tmp_bad" >/dev/null
  rm -f "$tmp_bad"
}

run_case_files "$FIXTURE_DIR/bad.md" "$FIXTURE_DIR/expected-fixed.md"
run_case "list-next"
run_case "heading-next"
run_case "quote-next"
run_case "table-next"
run_case "math-prime"
run_case "enumeration-comma"
run_case "enumeration-continuation-tail"

npx --yes markdownlint-cli2 "$FIXTURE_DIR/good.md" >/dev/null

echo "test-fence-inline-sandwich: PASS"

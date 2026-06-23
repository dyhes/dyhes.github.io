#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
HOOK_PATH="$ROOT_DIR/scripts/hooks/pre-commit"

TMP_DIR="$(mktemp -d /tmp/pre-commit-convergence-XXXXXX)"
cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

REPO_DIR="$TMP_DIR/repo"
BIN_DIR="$TMP_DIR/bin"
STATE_DIR="$TMP_DIR/state"
mkdir -p "$REPO_DIR" "$BIN_DIR" "$STATE_DIR"

cat >"$BIN_DIR/npx" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail

STATE_DIR="${FAKE_NPX_STATE_DIR:?}"
COUNT_FILE="$STATE_DIR/count"
if [ ! -f "$COUNT_FILE" ]; then
  echo 0 >"$COUNT_FILE"
fi

count="$(cat "$COUNT_FILE")"
count=$((count + 1))
echo "$count" >"$COUNT_FILE"

if [ "$1" = "--yes" ]; then
  shift
fi
if [ "$1" != "markdownlint-cli2" ]; then
  echo "unexpected command: $*" >&2
  exit 2
fi
shift

if [ "${1:-}" = "--fix" ]; then
  shift
  file="$1"
  content="$(cat "$file")"
  if [ "$content" = "bad" ]; then
    printf 'mid\n' >"$file"
  elif [ "$content" = "mid" ]; then
    printf 'good\n' >"$file"
  fi
  exit 0
fi

file="$1"
content="$(cat "$file")"
if [ "$content" = "good" ]; then
  exit 0
fi

echo "fake markdownlint: file not converged yet" >&2
exit 1
EOF
chmod +x "$BIN_DIR/npx"

cd "$REPO_DIR"
git init -q
git config user.name test
git config user.email test@example.com

printf 'bad\n' > sample.md
git add sample.md

PATH="$BIN_DIR:$PATH" FAKE_NPX_STATE_DIR="$STATE_DIR" bash "$HOOK_PATH" >/tmp/pre-commit-convergence.out 2>&1

if [ "$(cat sample.md)" != "good" ]; then
  echo "expected worktree content to converge to good"
  cat /tmp/pre-commit-convergence.out
  exit 1
fi

if [ "$(git show :sample.md)" != "good" ]; then
  echo "expected staged content to be re-added after convergence"
  cat /tmp/pre-commit-convergence.out
  exit 1
fi

if [ "$(cat "$STATE_DIR/count")" != "4" ]; then
  echo "expected 4 markdownlint invocations (fix, lint, fix, lint)"
  cat /tmp/pre-commit-convergence.out
  exit 1
fi

echo "test-pre-commit-convergence: PASS"

#!/usr/bin/env bash
mkdir -p "${CK_SPIKE_LOG_DIR:-/tmp/ck-spike-logs}"
LOG=${CK_SPIKE_LOG_DIR:-/tmp/ck-spike-logs}/session-start.log
input=$(cat)
{
  echo "=== $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo "CLAUDE_PLUGIN_ROOT=${CLAUDE_PLUGIN_ROOT:-<unset>}"
  echo "CLAUDE_PLUGIN_DATA=${CLAUDE_PLUGIN_DATA:-<unset>}"
  echo "stdin: $input"
} >> "$LOG" 2>/dev/null
if [ -d "$HOME/.claude/team" ] || [ -x "$HOME/.local/bin/claude-team" ]; then
  echo "The old team tool is still installed and its persona commands will collide with ck's. Remove it with the steps in the ck README."
fi
exit 0

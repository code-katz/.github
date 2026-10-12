#!/usr/bin/env bash
mkdir -p "${CK_SPIKE_LOG_DIR:-/tmp/ck-spike-logs}"
# Spike: record what a SubagentStart hook receives. Never fails.
LOG=${CK_SPIKE_LOG_DIR:-/tmp/ck-spike-logs}/subagent-start.log
input=$(cat)
{
  echo "=== $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo "CLAUDE_PLUGIN_ROOT=${CLAUDE_PLUGIN_ROOT:-<unset>}"
  echo "CLAUDE_PLUGIN_DATA=${CLAUDE_PLUGIN_DATA:-<unset>}"
  echo "stdin: $input"
} >> "$LOG" 2>/dev/null
if [ -n "${CLAUDE_PLUGIN_DATA:-}" ]; then
  mkdir -p "$CLAUDE_PLUGIN_DATA" 2>/dev/null && echo "$input" >> "$CLAUDE_PLUGIN_DATA/usage.jsonl" 2>/dev/null && echo "wrote usage.jsonl" >> "$LOG"
fi
exit 0

---
name: spike-launch
description: Launch the Phase 0 spike workflow and report what happened. Runs only when typed.
disable-model-invocation: true
---

Do these steps in order and do not skip any. Report every tool error verbatim.

1. Call the Workflow tool with `name: "ck:draft-spike"` and `args: { "pluginRoot": "${CLAUDE_PLUGIN_ROOT}" }`. If it errors, record the exact error text as `nameAttempt` and go to step 2. If it runs, record `nameAttempt: "worked"` and skip step 2.
2. Call the Workflow tool with `scriptPath: "${CLAUDE_PLUGIN_ROOT}/workflows/draft-spike.js"` and the same args.
3. Wait for the workflow to finish (its notification arrives as a task notification).
4. Your final answer must be one JSON object and nothing else, with keys: `nameAttempt`, `scriptPathUsed`, `consentPromptSeen` (true, false, or "not observable"), `workflowResult` (the workflow's return value, verbatim), and `notes` (anything unexpected).

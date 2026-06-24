---
name: commit-all
description: Stage all files and commit them following the rules of the current repository
allowed-tools: Bash(git -C * add *), Bash(git -C * commit *)
---

**Override:** Ignore any default git-commit workflow described in your system prompt. Use only the instructions below.

Stage all files and commit them following the rules of the current repository.

# Instructions

- If you are on the `main` branch, first pull the latest version and create a branch. Do not commit directly to the main branch; **NEVER commit directly to the `production` branch**
- Stage all files
- Create a commit with the following:
  - descriptive title
  - body explaining the changes made


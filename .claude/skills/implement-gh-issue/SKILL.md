---
name: implement-gh-issue
description: Given a github issue describing a piece of work, figure out the correct implementation
argument-hint: '[issue-id] [optional extra details]'
disable-model-invocation: true
---

You are a full-stack software engineer. Your job is to write code based on the work described in github issues, which could be new features, improvements to existing features, bug fixes or other work.

## Process

### Planning

- Using the gh cli, read through the details of issue $ARGUMENTS[0] and its related milestone (if one exists). Also read through any extra details in $ARGUMENTS[1] if provided.
- Aim to answer the following questions:
  - Is the scope of the work clear?
  - Do you have the information needed to do the work?
  - If a solution is suggested, does it seem to satisfactorily address the stated problem/desired feature?
  - Are there any undocumented assumptions or elements the story author might have overlooked?
- Ask any clarifications needed based on the above
- Once the requirements are clarified, look through the code and any existing documentation and make a plan

### Implementation

- Fetch the latest version of the default development branch in the current repository
- Create a new git branch following the guidelines in CLAUDE.md
- Modify the files as needed

### Quality check

Once the required changes are made, always validate your work:

- Run the `code-quality-gate` skill
- Run a separate agent to review the code changes. Provide them with a summary of what has changed and why to the same level of detail that would be present in a pull request.
- Address any feedback from the review.

## Additional guidelines

- Start work in Plan mode first and think thoroughly through the task before implementing
- Make sure to document any assumptions or uncovered edge cases where relevant
- Always aim to follow the standards of the current codebase. Before making changes, look for guidance in the following places (if available): `AGENTS.md`, `CLAUDE.md`, `/docs`
- As an engineer, your time is valuable. Do not spend it lightly. Look for simple implementations where possible and avoid reinventing the wheel.
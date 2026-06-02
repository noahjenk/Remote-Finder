# Remote Finder — GitHub Issue Rules

These rules exist because large vague issues are difficult for GitHub Copilot to implement correctly.

## One issue = one small change

Each issue should change one clear thing.

Good:

- “Update README to match current prototype”
- “Move disclaimer into its own component”
- “Add warning when map view is too large”

Bad:

- “Improve the app”
- “Make Remote Finder production ready”
- “Add all remaining map features”

## Every issue should include

Each issue should have:

1. Goal
2. Why this matters
3. Tasks
4. Files likely involved
5. What not to change
6. Acceptance criteria
7. Manual testing instructions

## Copilot instructions inside each issue

Each issue should tell Copilot:

- Read the relevant docs first.
- Implement only this issue.
- Do not add extra features.
- Do not change app behaviour unless the issue asks for it.
- Do not add dark mode.
- Keep the app working.
- Explain what changed.

## Avoid vague wording

Avoid phrases like:

- “clean up the app”
- “make it better”
- “optimise everything”
- “improve UI”
- “fix all issues”

Replace them with specific tasks.

## Keep beginner-friendly scope

The user is a beginner.

Issues should be small enough that the user can:

- understand what changed
- test it manually
- commit it confidently
- update `docs/STATUS.md`

## Recommended issue size

A good issue should usually affect:

- one file, or
- a small group of closely related files.

If an issue would touch many unrelated files, split it.

## When refactoring

Refactoring issues must say:

- Do not change visible behaviour.
- Do not add features.
- Keep the app running.
- Move code in small steps.
- Test before and after.

## When working with Overpass

Issues involving Overpass must preserve these rules:

- Do not fetch automatically on every map movement.
- Use manual search/refresh.
- Keep map-area limits in mind.
- Show loading and error states.
- Do not use Overpass for bulk downloads.

## When updating docs

Docs should be practical and specific.

Do not turn docs into a huge fantasy roadmap.

Docs should help the next ChatGPT/Copilot session understand:

- what Remote Finder is
- what has been built
- what not to work on yet
- what the next issue is

# GitHub Copilot Instructions for Remote Finder

Remote Finder is an open-source React + Vite web app using Leaflet/OpenStreetMap to help users explore areas farther away from mapped buildings and other signs of human presence.

## Read these docs first

Before making changes, read:

- `docs/PROJECT_BRIEF.md`
- `docs/ROADMAP.md`
- `docs/STATUS.md`
- `docs/DECISIONS.md`
- `docs/ISSUE_RULES.md`
- `README.md`

If these docs conflict with a GitHub issue, follow the issue only if it is clearly newer and specific.

## Core product rule

Remote Finder shows distance from mapped features only.

It must not claim that an area is safe, legal, accessible, empty, unused, permission-free, or suitable for any activity.

## Current priority

The current priority is to stabilise the prototype and keep the repo as the source of truth.

Do not add unrelated features.

## Do not work on these unless explicitly requested

- Dark mode
- Accounts
- Saving projects
- Sharing projects
- Mobile app
- Offline mode
- Satellite layers
- Direct OpenStreetMap editing
- Backend/database
- Complex multi-layer remoteness scoring
- Automatic “best area” recommendations

## Development style

Make small, understandable changes.

Prefer beginner-friendly code over clever code.

Do not rewrite large parts of the app unless the issue specifically asks for a refactor.

Do not change app behaviour during documentation-only issues.

Do not add new dependencies unless the issue specifically asks for them.

## Current technical direction

The prototype uses:

- React
- Vite
- Leaflet
- React Leaflet
- OpenStreetMap tiles
- Overpass API
- osmtogeojson
- Turf

The core workflow is:

1. User opens map.
2. User adjusts radius.
3. User manually searches current area.
4. App fetches mapped buildings from Overpass.
5. App converts data to GeoJSON.
6. App displays buildings and avoid-zone buffers.
7. User can move the map and manually search again.

## Overpass rules

Do not make the app fetch on every pan or zoom.

Manual search/refresh is preferred.

Avoid large-area or repeated requests.

Keep loading, error, and empty-result states understandable.

## Pull request / change summary

After making changes, explain:

- which files changed
- what changed
- what did not change
- how to test it manually

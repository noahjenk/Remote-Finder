# Remote Finder — Status

Last updated: 2026-06-02

## Current summary

Remote Finder is in early prototype development.

The app currently appears to have moved beyond the basic map/slider stage and now includes the main building search and avoid-zone prototype chain.

## Current stack

- React
- Vite
- Leaflet
- React Leaflet
- OpenStreetMap tiles
- Overpass API
- osmtogeojson
- Turf

## Appears completed

- React + Vite app setup
- Full-screen OpenStreetMap basemap
- First-load disclaimer using browser storage
- Radius slider
- Manual “Search this area” workflow
- Overpass query for `building=*`
- OSM-to-GeoJSON conversion
- Building outlines display
- Loading/error/empty-result messages
- Turf buffers around buildings
- Attempt to merge/dissolve overlapping buffers
- Building outlines toggle
- Map moved since last search message

## Important correction

Dark mode is not a current feature priority.

Even if there was a previous issue or experiment for dark mode, it has been deliberately postponed/removed. Do not add it back unless explicitly requested later.

## Current concern

Project information is spread across ChatGPT chats, GitHub issues, Copilot changes, README, uploaded notes, and memory.

The next task is to make the repo itself the source of truth.

## Next issue to do

Add project source-of-truth docs and Copilot guardrails.

Files to create:

- `docs/PROJECT_BRIEF.md`
- `docs/ROADMAP.md`
- `docs/STATUS.md`
- `docs/DECISIONS.md`
- `docs/ISSUE_RULES.md`
- `.github/copilot-instructions.md`

## After that

Likely next technical issue:

Update the README so it matches the real current prototype.

Possible issue after README:

Refactor `src/App.jsx` into smaller beginner-friendly files/components without changing app behaviour.

## Manual testing checklist

Before marking a feature issue as complete, test:

- App starts with `npm run dev`.
- Map fills the browser window.
- Disclaimer appears only when expected.
- Radius slider changes the displayed radius.
- Search button fetches buildings for the current view.
- Building outlines appear when results are found.
- Avoid-zone shading appears when radius is above 0.
- Moving the map after searching prompts the user to search again.
- App does not crash when the Overpass request fails.
- Browser console has no unexpected serious errors.

# Remote Finder — Roadmap

This roadmap is intentionally small and practical. It exists to stop the project drifting.

## Current phase: stabilise the prototype and source of truth

Goal:

Make the repo itself explain what Remote Finder is, what has been built, what comes next, and what Copilot should not touch.

Current priority:

1. Add source-of-truth docs.
2. Add Copilot guardrails.
3. Update status after each completed issue.
4. Keep future issues small.

## Prototype v0.1 — Core Map Demo

Goal:

Prove that Remote Finder can show a map, fetch mapped buildings, and display avoid zones based on a chosen radius.

Expected prototype chain:

1. Full-screen OpenStreetMap map.
2. First-load disclaimer.
3. Radius slider.
4. Manual search for buildings in current map area.
5. Convert Overpass data into GeoJSON.
6. Display building outlines.
7. Create radius buffers around buildings.
8. Merge/dissolve overlapping buffers where possible.
9. Show cleaner shaded avoid zones.
10. Avoid automatic repeated Overpass requests.
11. Let user manually refresh/search the current area.

Status:

Most of this chain appears to have been implemented. See `docs/STATUS.md` for the current working state.

## Next sensible technical phase: tidy and stabilise

Only start this after the documentation issue is done.

Possible next issues:

1. Update README so it matches the real current prototype.
2. Split large `App.jsx` logic into smaller files/components.
3. Add safer search limits for large map areas.
4. Improve user messages for Overpass errors and large areas.
5. Add basic manual testing checklist.
6. Check that changing the radius does not refetch Overpass data.
7. Check that moving the map clearly tells the user to search again.

## Later phase: better controls

Only after the core prototype is stable.

Possible features:

- Better building outline toggle.
- Info/help button explaining shaded vs clear areas.
- Basic layer control structure.
- Optional extra avoid layers later.

Do not add lots of feature layers at once.

## Later phase: drawing and notes

Only after the avoid-zone workflow is reliable.

Possible features:

- Draw marker.
- Draw polygon.
- Draw line.
- Edit/delete drawn shapes.
- Add local notes.
- Store drawings locally in the browser at first.

Drawing should come before accounts.

## Later phase: saving and sharing

Postponed.

Possible features:

- Accounts.
- Saved projects.
- Shareable view-only links.
- Project notes.
- Import/export.

Do not work on this yet.

## Explicitly postponed

Do not work on these now:

- Dark mode
- Mobile app
- Offline mode
- Satellite layers
- Direct OpenStreetMap editing
- Full backend
- User accounts
- Saved projects
- Share links
- Complex custom buffer distances per layer

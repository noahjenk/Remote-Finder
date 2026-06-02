# Remote Finder — Product Decisions

This file records decisions that should not be re-asked in every new chat or issue.

## Decision 1: Map first

Remote Finder should open straight into the map.

No landing page should appear before the main map.

## Decision 2: No forced account

Users should be able to use the core map without signing in.

The intended flow is:

explore first → draw later → create account only if saving/sharing is needed

## Decision 3: OpenStreetMap first

OpenStreetMap is the preferred first data source.

Reasons:

- It is open data.
- It fits the open-source project direction.
- It includes buildings, roads, farms, paths, land use, and other useful mapped features.

## Decision 4: Buildings first

Buildings are the first avoid feature.

The prototype should focus on `building=*` before trying to handle roads, tracks, farms, settlements, or other feature types.

## Decision 5: One shared radius first

The first version should use one shared radius slider.

Custom buffer distances per layer can come later, but should not be added now.

## Decision 6: Manual search workflow

The app should not constantly fetch Overpass data while the user pans and zooms.

The preferred prototype workflow is:

1. User moves the map.
2. User clicks “Search this area”.
3. App fetches mapped buildings for the current view.
4. App uses the loaded data for display and buffer calculations.

## Decision 7: Clean merged avoid zones

The intended visual output is a clean shaded avoid-zone shape.

The app should avoid showing lots of overlapping circles as the final user-facing result.

Internal calculations can use individual buffers, but the user-facing layer should be merged/dissolved where possible.

## Decision 8: Be honest about data limits

Remote Finder must not claim certainty.

It must not claim that an area is:

- safe
- legal
- accessible
- empty
- unused
- permission-free
- suitable for any activity

It only shows distance from mapped features.

## Decision 9: Direct OSM editing is postponed

Do not add direct OpenStreetMap editing early.

A future safer approach could allow users to flag missing features or link to proper OSM editing guidance, but the prototype should not edit OSM.

## Decision 10: Dark mode is postponed

Dark mode is not a current priority.

Do not re-add dark mode unless explicitly requested later.

## Decision 11: Accounts, saving, sharing, mobile, offline, and satellite are later

These are valid future ideas, but not current work.

Do not start them until the core prototype is stable and the user explicitly chooses that phase.

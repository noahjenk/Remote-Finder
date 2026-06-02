# Remote Finder — Project Brief

## What Remote Finder is

Remote Finder is an open-source web map for exploring areas that are farther away from mapped buildings and other signs of human presence.

It is built as a React + Vite web app using Leaflet/OpenStreetMap. The prototype uses OpenStreetMap/Overpass building data and Turf geospatial tools to create avoid zones around mapped buildings.

Remote Finder is a planning and scouting tool. It does not confirm land ownership, legal access, permission, hazards, safety, emptiness, or suitability for any activity.

## Core prototype idea

The core prototype chain is:

map → radius slider → fetch buildings → display buildings → buffer buildings → merge/clean avoid-zone visualisation → manual search workflow

The first prototype should prove that a user can:

1. Open the app straight into a full-screen map.
2. Choose an avoid radius.
3. Search the current map area for mapped buildings.
4. See building outlines.
5. See shaded avoid zones around those buildings.
6. Move the map and manually search again.
7. Understand that clear areas are only farther from currently loaded mapped features.

## What the shaded area means

The shaded area means:

> This area is within the selected radius of the currently loaded mapped features.

The clear area means:

> This area is farther away from the currently loaded mapped features.

The app must not say or imply that a clear area is safe, legal, accessible, unused, empty, permission-free, or suitable.

## Current data source

OpenStreetMap is the preferred first data source because it is open and fits the open-source nature of the project.

The prototype uses Overpass API to fetch OSM objects tagged with `building=*` inside the current visible map area.

## Important limitations

OpenStreetMap data may be incomplete, outdated, or inconsistently tagged.

Buildings may be missing. Farm buildings may be unclear. Rural areas may have less complete mapping than towns. A clear area in Remote Finder may still contain unmapped buildings, hazards, private land, legal restrictions, or other real-world issues.

The app should always describe results as distance from mapped features, not real-world certainty.

## Current focus

The current focus is not to add lots of features.

The immediate goal is to make the repo itself explain what Remote Finder is, what has been built, what comes next, and what Copilot should not touch.

## Not current priorities

Do not work on these unless explicitly requested later:

- Dark mode
- Accounts
- Saving projects
- Sharing projects
- Mobile app
- Offline mode
- Satellite layers
- Direct OpenStreetMap editing
- Advanced multi-layer remoteness scoring
- Automatic “best remote area” recommendations

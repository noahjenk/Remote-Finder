# Remote Finder

Remote Finder is an open-source web mapping tool for exploring areas that are farther away from mapped buildings and other signs of human presence.

The app is intended as a planning and scouting tool. It does not confirm land ownership, legal access, permission, hazards, safety, or suitability for any activity.

## Core idea

Remote Finder shows an interactive map. Users can load mapped building data for the visible area, adjust a radius, and see shaded avoid zones around those features.

Clear areas are farther away from the selected mapped features.

## Current prototype

The current prototype includes:

* React + Vite web app
* Leaflet/OpenStreetMap basemap
* First-load disclaimer popup
* Adjustable radius slider
* Manual “Search this area” workflow
* Overpass query for `building=*`
* Building outlines display
* Buffer avoid zones around buildings
* Merged/dissolved avoid-zone visualisation
* Loading, error, and empty-result states
* Warning when the map has moved since last search

## Not current priorities

The prototype does not currently focus on:

* Dark mode
* Accounts or saved projects
* Sharing links
* Mobile app support
* Offline mode
* Satellite imagery layers
* Direct OpenStreetMap editing
* Complex remoteness scoring or “best area” recommendations

## Important disclaimer

Remote Finder shows distance from mapped features only. It does not confirm land ownership, legal access, permission, hazards, safety, or suitability for any activity.

OpenStreetMap data may be incomplete, outdated, or inconsistently tagged.

## Development

To run the app locally:

```bash
npm install
npm run dev
```

Open the local Vite URL shown in the terminal.

## Development status

Remote Finder is in early prototype development.

Current milestone:

**Prototype v0.1 — Core Map Demo**

The goal is to prove the main workflow:

map → radius slider → manual search → building outlines → avoid-zone buffers → merged shaded areas.

## Open source

Remote Finder is open source under the MIT License.

Contributions, ideas, bug reports, and improvements are welcome as the project develops.

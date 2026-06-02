# OSM Building Data Research

Remote Finder needs building data so it can show areas that are farther away from mapped buildings and other signs of human presence.

For the prototype, Remote Finder will fetch building data from OpenStreetMap using the Overpass API.

## Why OpenStreetMap?

OpenStreetMap is open geographic data created and maintained by contributors. It is a good fit for Remote Finder because the project is also open source and because OSM includes many mapped buildings, farms, houses, industrial buildings, sheds, barns, and other structures.

Remote Finder will not treat OSM data as perfect. It will only use it as a useful planning layer.

## What building data means

In OpenStreetMap, buildings are usually marked with the `building=*` tag.

This can include many different types of buildings, for example:

* houses
* apartments
* farm buildings
* barns
* sheds
* garages
* industrial buildings
* commercial buildings
* public buildings

For the first prototype, Remote Finder should fetch all objects with a `building` tag rather than trying to decide which buildings are residential.

This is important because the goal is not only to avoid towns and houses. The goal is to find areas away from mapped human structures, including farms and isolated buildings.

## How the prototype will fetch data

The prototype will use the Overpass API.

Overpass API allows apps to query OpenStreetMap data. Remote Finder can ask Overpass for building features inside the currently visible map area.

A prototype Overpass query could look like this:

```overpassql
[out:json][timeout:25];
(
  way["building"]({{bbox}});
  relation["building"]({{bbox}});
);
out body;
>;
out skel qt;
```

In the real app, `{{bbox}}` will be replaced by the visible map bounds.

The app will then convert the returned OSM building geometry into map shapes that Leaflet can display.

## Prototype fetching rule

Remote Finder should not automatically fetch building data every time the map moves.

For the prototype, the safer rule is:

1. User moves the map to an area.
2. User clicks a button such as “Load buildings for this area”.
3. The app sends one Overpass request for the current visible map area.
4. The app displays building outlines or uses them to generate avoid zones.

This avoids sending too many requests while the user pans and zooms around.

## Safe prototype limits

To avoid overloading public Overpass servers, the prototype should follow these limits:

* Only fetch data after the user clicks a button.
* Do not fetch automatically on every map movement.
* Use the current visible map area, not a huge region.
* Start testing with small areas only.
* Show a loading state while data is being fetched.
* Show an error message if the request fails.
* Avoid repeated requests for the same area.
* Consider caching the most recent result in browser memory.
* Add a timeout to Overpass queries.
* Do not use this as a bulk data download tool.

## Limitations of OSM building data

Remote Finder must clearly explain that OpenStreetMap data may be incomplete or wrong.

Possible limitations:

* Some buildings may be missing from OSM.
* Some mapped buildings may no longer exist.
* Some new buildings may not have been added yet.
* Some building tags may be inaccurate.
* Small structures such as sheds or barns may be inconsistently mapped.
* Rural and farm areas may have less complete detail than urban areas.
* OSM does not prove whether land is public or private.
* OSM does not prove whether access is legal or safe.

Because of this, Remote Finder must not describe areas as definitely remote, legal, safe, empty, or suitable for any activity.

The app should describe results as “farther from mapped buildings”, not “free from buildings” or “safe to use”.

## Privacy and safety wording

Remote Finder should avoid encouraging trespass or unsafe activity.

Suggested wording:

> Remote Finder is a planning and scouting tool. It shows distance from mapped OpenStreetMap features only. It does not confirm land ownership, legal access, permission, hazards, safety, or suitability for any activity.

## Future improvements

The prototype will start with `building=*`.

Later versions could also consider other OSM tags, such as:

* `building:part=*`
* `amenity=*`
* `landuse=farmyard`
* `man_made=*`
* `tourism=*`
* `shop=*`
* `office=*`
* `industrial=*`
* roads, tracks, and paths

These should be optional layers or toggles because OpenStreetMap tagging can be inconsistent.

## Decision for prototype v0.1

For Prototype v0.1, Remote Finder will:

* use Overpass API
* fetch `building=*` ways and relations
* fetch only the visible map area
* require a manual “Load buildings” action
* avoid automatic repeated requests
* treat results as incomplete planning data
* keep clear disclaimers in the app and documentation

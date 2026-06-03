import { useEffect, useRef, useState } from 'react'
import {
  GeoJSON,
  MapContainer,
  TileLayer,
  ZoomControl,
  useMap,
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import './App.css'
import L from 'leaflet'
import osmtogeojson from 'osmtogeojson'
import { buffer as turfBuffer, dissolve as turfDissolve } from '@turf/turf'

const DISCLAIMER_STORAGE_KEY = 'remoteFinderDisclaimerDismissed'
const MAX_SEARCH_AREA_KM2 = 200

function formatRadius(radiusMetres) {
  if (radiusMetres < 1000) {
    return `${radiusMetres}m`
  }

  const radiusKm = radiusMetres / 1000
  return `${radiusKm.toFixed(1)}km`
}

function calculateBoundsAreaKm2(bounds) {
  const lat1 = bounds.south
  const lat2 = bounds.north
  const lon1 = bounds.west
  const lon2 = bounds.east

  const latAvg = (lat1 + lat2) / 2
  const kmPerDegLat = 110.574
  const kmPerDegLon = 111.320 * Math.cos((latAvg * Math.PI) / 180)

  const heightKm = Math.abs(lat2 - lat1) * kmPerDegLat
  const widthKm = Math.abs(lon2 - lon1) * kmPerDegLon

  return heightKm * widthKm
}

function MapWatcher({ onMapMove }) {
  const map = useMap()

  useEffect(() => {
    function handleMove() {
      onMapMove(map.getBounds())
    }

    map.on('moveend', handleMove)
    map.on('zoomend', handleMove)

    return () => {
      map.off('moveend', handleMove)
      map.off('zoomend', handleMove)
    }
  }, [map, onMapMove])

  return null
}

function MapControls({
  radiusMetres,
  onRadiusChange,
  onSearchBuildings,
  loadingBuildings,
  statusMessage,
  statusType,
  showBuildings,
  onToggleBuildings,
  mapMovedSinceSearch,
  areaTooLarge,
  areaKm2,
}) {
  const map = useMap()
  const controlsRef = useRef(null)

  useEffect(() => {
    if (!controlsRef.current) {
      return
    }

    L.DomEvent.disableClickPropagation(controlsRef.current)
    L.DomEvent.disableScrollPropagation(controlsRef.current)
  }, [])

  function handleSearchClick() {
    const bounds = map.getBounds()

    onSearchBuildings({
      south: bounds.getSouth(),
      west: bounds.getWest(),
      north: bounds.getNorth(),
      east: bounds.getEast(),
    })
  }

  return (
    <div className="map-controls" ref={controlsRef}>
      <div className="control-card">
        <div className="control-header">
          <label htmlFor="radius-slider">Avoid radius</label>
          <strong>{formatRadius(radiusMetres)}</strong>
        </div>

        <input
          id="radius-slider"
          type="range"
          min="0"
          max="2000"
          step="50"
          value={radiusMetres}
          onChange={onRadiusChange}
          onMouseDown={(event) => event.stopPropagation()}
          onTouchStart={(event) => event.stopPropagation()}
        />

        <div className="slider-labels">
          <span>0m</span>
          <span>2km</span>
        </div>

        <p className="control-help">
          Shaded avoid zones will use this distance once building data is added.
        </p>
      </div>

      <div className="control-card">
        <button
          className="search-button"
          type="button"
          onClick={handleSearchClick}
          disabled={loadingBuildings || areaTooLarge}
        >
          {loadingBuildings ? 'Searching...' : 'Search this area'}
        </button>

        {areaTooLarge && !loadingBuildings && (
          <p className="status-message warning-message">
            The current view is too large ({areaKm2.toFixed(0)} km²). Zoom in or move closer before searching.
          </p>
        )}

        {!areaTooLarge && mapMovedSinceSearch && !loadingBuildings && (
          <p className="status-message warning-message">
            Map moved since the last search. Click Search this area to refresh.
          </p>
        )}

        {statusMessage && !loadingBuildings && (
          <p
            className={`status-message ${
              statusType === 'error'
                ? 'error-message'
                : statusType === 'success'
                ? 'success-message'
                : statusType === 'empty'
                ? 'empty-message'
                : statusType === 'warning'
                ? 'warning-message'
                : ''
            }`}
          >
            {statusMessage}
          </p>
        )}

        <div className="toggle-row">
          <label htmlFor="show-buildings-toggle">
            <input
              id="show-buildings-toggle"
              type="checkbox"
              checked={showBuildings}
              onChange={onToggleBuildings}
            />
            Show building outlines
          </label>
        </div>
      </div>
    </div>
  )
}

function App() {
  const defaultPosition = [54.508, -1.55]

  const [showDisclaimer, setShowDisclaimer] = useState(false)
  const [radiusMetres, setRadiusMetres] = useState(500)
  const [showBuildings, setShowBuildings] = useState(true)
  const [buildingsGeoJSON, setBuildingsGeoJSON] = useState(null)
  const [bufferGeoJSON, setBufferGeoJSON] = useState(null)
  const [loadingBuildings, setLoadingBuildings] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [statusType, setStatusType] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const [mapMovedSinceSearch, setMapMovedSinceSearch] = useState(false)

  useEffect(() => {
    const hasDismissedDisclaimer = localStorage.getItem(
      DISCLAIMER_STORAGE_KEY,
    )

    if (!hasDismissedDisclaimer) {
      setShowDisclaimer(true)
    }
  }, [])

  function dismissDisclaimer() {
    localStorage.setItem(DISCLAIMER_STORAGE_KEY, 'true')
    setShowDisclaimer(false)
  }

  function handleRadiusChange(event) {
    setRadiusMetres(Number(event.target.value))
  }

  function handleToggleBuildings(event) {
    setShowBuildings(event.target.checked)
  }

  const [currentBounds, setCurrentBounds] = useState(null)

  const areaKm2 = currentBounds ? calculateBoundsAreaKm2(currentBounds) : 0
  const areaTooLarge = currentBounds
    ? areaKm2 > MAX_SEARCH_AREA_KM2
    : false

  function handleMapMove(bounds) {
    setCurrentBounds(bounds)
    if (hasSearched && !loadingBuildings) {
      setMapMovedSinceSearch(true)
    }
  }

  async function searchBuildings(bounds) {
    const searchArea = calculateBoundsAreaKm2(bounds)

    if (searchArea > MAX_SEARCH_AREA_KM2) {
      setStatusMessage(
        `The current view is too large (${searchArea.toFixed(0)} km²). Zoom in or move closer before searching.`,
      )
      setStatusType('warning')
      setLoadingBuildings(false)
      return
    }

    setLoadingBuildings(true)
    setStatusMessage('Loading mapped buildings...')
    setStatusType('loading')
    setMapMovedSinceSearch(false)

    const overpassQuery = `
      [out:json][timeout:25];
      (
        way["building"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
        relation["building"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
      );
      out body;
      >;
      out skel qt;
    `

    try {
      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: overpassQuery,
      })

      if (!response.ok) {
        throw new Error('The building search failed.')
      }

      const rawData = await response.json()
      const convertedGeoJSON = osmtogeojson(rawData)
      const buildingFeatures = (convertedGeoJSON.features || []).filter(
        (feature) => feature.geometry,
      )
      const geojson = {
        type: 'FeatureCollection',
        features: buildingFeatures,
      }

      setBuildingsGeoJSON(geojson)
      setHasSearched(true)

      if (buildingFeatures.length === 0) {
        setStatusMessage('No buildings found in this view.')
        setStatusType('empty')
      } else {
        setStatusMessage(
          `Loaded ${buildingFeatures.length} building outline${
            buildingFeatures.length === 1 ? '' : 's'
          }.`,
        )
        setStatusType('success')
      }

      console.log('Fetched OSM building data:', rawData)
      console.log('Converted building GeoJSON:', geojson)
    } catch (error) {
      console.error(error)
      setBuildingsGeoJSON(null)
      setBufferGeoJSON(null)
      setStatusMessage('Could not load buildings. Try again or zoom in.')
      setStatusType('error')
    } finally {
      setLoadingBuildings(false)
    }
  }

  useEffect(() => {
    if (!buildingsGeoJSON || radiusMetres === 0) {
      setBufferGeoJSON(null)
      return
    }

    try {
      const bufferFeatures = buildingsGeoJSON.features
        .map((feature) => turfBuffer(feature, radiusMetres, { units: 'meters' }))
        .filter(Boolean)

      if (bufferFeatures.length === 0) {
        setBufferGeoJSON(null)
        return
      }

      const bufferCollection = {
        type: 'FeatureCollection',
        features: bufferFeatures,
      }

      const mergedFeature = turfDissolve(bufferCollection)
      setBufferGeoJSON(mergedFeature)
    } catch (error) {
      console.error('Buffer merge failed:', error)
      const fallbackFeatures = buildingsGeoJSON.features
        .map((feature) => turfBuffer(feature, radiusMetres, { units: 'meters' }))
        .filter(Boolean)

      setBufferGeoJSON({ type: 'FeatureCollection', features: fallbackFeatures })
    }
  }, [buildingsGeoJSON, radiusMetres])

  return (
    <div className="app">
      <MapContainer
        className="map"
        center={defaultPosition}
        zoom={13}
        zoomControl={false}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ZoomControl position="bottomright" />
        <MapWatcher onMapMove={handleMapMove} />

        <MapControls
          radiusMetres={radiusMetres}
          onRadiusChange={handleRadiusChange}
          onSearchBuildings={searchBuildings}
          loadingBuildings={loadingBuildings}
          statusMessage={statusMessage}
          statusType={statusType}
          showBuildings={showBuildings}
          onToggleBuildings={handleToggleBuildings}
          mapMovedSinceSearch={mapMovedSinceSearch}
          areaTooLarge={areaTooLarge}
          areaKm2={areaKm2}
        />

        {bufferGeoJSON && (
          <GeoJSON
            data={bufferGeoJSON}
            style={{
              fillColor: '#ea5252',
              color: '#b3261e',
              weight: 1,
              fillOpacity: 0.22,
            }}
          />
        )}

        {showBuildings && buildingsGeoJSON && (
          <GeoJSON
            data={buildingsGeoJSON}
            style={{
              color: '#1b4f72',
              weight: 2,
              fillOpacity: 0,
            }}
          />
        )}
      </MapContainer>

      {showDisclaimer && (
        <div className="disclaimer-backdrop">
          <div className="disclaimer-card">
            <p className="disclaimer-label">Important notice</p>
            <h1>Remote Finder is a planning tool.</h1>
            <p>
              Remote Finder shows distance from mapped features only. It does
              not confirm land ownership, legal access, permission, hazards,
              safety, or suitability for any activity.
            </p>
            <button type="button" onClick={dismissDisclaimer}>
              I understand
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
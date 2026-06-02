import { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, ZoomControl, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import './App.css'
import L from 'leaflet'

const DISCLAIMER_STORAGE_KEY = 'remoteFinderDisclaimerDismissed'

function formatRadius(radiusMetres) {
  if (radiusMetres < 1000) {
    return `${radiusMetres}m`
  }

  const radiusKm = radiusMetres / 1000
  return `${radiusKm.toFixed(1)}km`
}

function MapControls({
  radiusMetres,
  onRadiusChange,
  onSearchBuildings,
  loadingBuildings,
  buildingError,
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
          disabled={loadingBuildings}
        >
          {loadingBuildings ? 'Searching...' : 'Search this area'}
        </button>

        {loadingBuildings && (
          <p className="status-message">Loading mapped buildings...</p>
        )}

        {buildingError && (
          <p className="status-message error-message">{buildingError}</p>
        )}
      </div>
    </div>
  )
}

function App() {
  const defaultPosition = [54.508, -1.55]

  const [showDisclaimer, setShowDisclaimer] = useState(false)
  const [radiusMetres, setRadiusMetres] = useState(500)

  const [buildingsData, setBuildingsData] = useState(null)
  const [loadingBuildings, setLoadingBuildings] = useState(false)
  const [buildingError, setBuildingError] = useState('')

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

  async function searchBuildings(bounds) {
    setLoadingBuildings(true)
    setBuildingError('')

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

      const data = await response.json()

      setBuildingsData(data)

      console.log('Fetched OSM building data:', data)
    } catch (error) {
      console.error(error)
      setBuildingError('Could not load buildings. Try again or zoom in.')
    } finally {
      setLoadingBuildings(false)
    }
  }

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

        <MapControls
          radiusMetres={radiusMetres}
          onRadiusChange={handleRadiusChange}
          onSearchBuildings={searchBuildings}
          loadingBuildings={loadingBuildings}
          buildingError={buildingError}
        />
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
import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import './App.css'

const DISCLAIMER_STORAGE_KEY = 'remoteFinderDisclaimerDismissed'

function formatRadius(radiusMetres) {
  if (radiusMetres < 1000) {
    return `${radiusMetres}m`
  }

  const radiusKm = radiusMetres / 1000
  return `${radiusKm.toFixed(1)}km`
}

function App() {
  const defaultPosition = [54.508, -1.55]
  const [showDisclaimer, setShowDisclaimer] = useState(false)
  const [radiusMetres, setRadiusMetres] = useState(500)

  useEffect(() => {
    const hasDismissedDisclaimer = localStorage.getItem(DISCLAIMER_STORAGE_KEY)

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

  return (
    <main className="app">
      <MapContainer
        center={defaultPosition}
        zoom={13}
        minZoom={3}
        maxZoom={19}
        zoomControl={false}
        className="map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ZoomControl position="bottomright" />
      </MapContainer>

      <section className="control-panel">
        <div className="control-panel-header">
          <div>
            <p className="control-label">Avoid radius</p>
            <h1>{formatRadius(radiusMetres)}</h1>
          </div>
        </div>

        <label className="slider-label" htmlFor="radius-slider">
          Distance from mapped features
        </label>

        <input
          id="radius-slider"
          type="range"
          min="0"
          max="2000"
          step="50"
          value={radiusMetres}
          onChange={handleRadiusChange}
        />

        <div className="slider-values">
          <span>0m</span>
          <span>2km</span>
        </div>

        <p className="control-help">
          Shaded avoid zones will use this distance once building data is added.
        </p>
      </section>

      {showDisclaimer && (
        <div className="disclaimer-backdrop">
          <section className="disclaimer-card">
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
          </section>
        </div>
      )}
    </main>
  )
}

export default App
import './App.css'

function App() {
  return (
    <main className="app">
      <section className="hero">
        <p className="eyebrow">Remote Finder</p>
        <h1>Find places farther away from mapped buildings.</h1>
        <p className="intro">
          Remote Finder is an open-source scouting map that will help visualise
          distance from mapped buildings and other signs of human presence.
        </p>

        <div className="status-card">
          <h2>Prototype v0.1</h2>
          <p>
            First goal: build a browser map with a radius slider and shaded
            avoid zones.
          </p>
        </div>
      </section>
    </main>
  )
}

export default App
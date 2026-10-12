import { NavLink, Route, Routes, useLocation } from 'react-router-dom'
import './App.css'

const sections = [
  { path: '/', label: 'Dashboard' },
  { path: '/activities', label: 'Activities' },
  { path: '/teams', label: 'Teams' },
  { path: '/leaderboard', label: 'Leaderboard' },
  { path: '/workouts', label: 'Workouts' },
]

function Dashboard() {
  return (
    <section className="py-5">
      <p className="text-uppercase text-success fw-semibold small mb-2">Overview</p>
      <h1 className="display-5 fw-bold">Your fitness journey starts here.</h1>
      <p className="lead text-secondary">
        Log activities, connect with your team, and track your progress.
      </p>
      <div className="row g-3 mt-4">
        {sections.slice(1).map(({ path, label }) => (
          <div className="col-sm-6 col-lg-3" key={path}>
            <NavLink className="card card-body h-100 text-decoration-none text-dark" to={path}>
              <span className="fw-semibold">{label}</span>
              <span className="text-secondary small mt-2">Coming soon</span>
            </NavLink>
          </div>
        ))}
      </div>
    </section>
  )
}

function SectionPlaceholder() {
  const { pathname } = useLocation()
  const title = sections.find(({ path }) => path === pathname)?.label ?? 'Page'

  return (
    <section className="py-5">
      <h1 className="display-6 fw-bold">{title}</h1>
      <p className="text-secondary">This section is ready for the next step in your tracker.</p>
    </section>
  )
}

function App() {
  return (
    <div className="min-vh-100 bg-light">
      <header className="bg-white border-bottom">
        <nav className="container navbar navbar-expand-lg py-3">
          <NavLink className="navbar-brand d-flex align-items-center gap-2 fw-bold" to="/">
            <img src="/octofitapp-small.png" alt="" width="36" height="36" />
            OctoFit Tracker
          </NavLink>
          <div className="navbar-nav ms-auto flex-row flex-wrap gap-2 gap-lg-3">
            {sections.map(({ path, label }) => (
              <NavLink
                className={({ isActive }) =>
                  `nav-link${isActive ? ' active fw-semibold text-success' : ''}`
                }
                end={path === '/'}
                key={path}
                to={path}
              >
                {label}
              </NavLink>
            ))}
          </div>
        </nav>
      </header>
      <main className="container">
        <Routes>
          <Route element={<Dashboard />} path="/" />
          <Route element={<SectionPlaceholder />} path="*" />
        </Routes>
      </main>
    </div>
  )
}

export default App

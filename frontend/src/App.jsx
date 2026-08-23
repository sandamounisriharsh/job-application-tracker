import { useCallback, useEffect, useMemo, useState } from 'react'
import ApplicationForm from './components/ApplicationForm.jsx'
import ApplicationList from './components/ApplicationList.jsx'
import StatusChart from './components/StatusChart.jsx'
import {
  createApplication,
  deleteApplication,
  getApplications,
  getStats,
  updateApplication,
} from './api.js'

const STATUSES = ['Applied', 'Interview', 'Offer', 'Rejected']

const STATUS_META = {
  Applied: { icon: '↗', label: 'Applied' },
  Interview: { icon: '◎', label: 'Interviews' },
  Offer: { icon: '✓', label: 'Offers' },
  Rejected: { icon: '×', label: 'Rejected' },
}

function SparkleIcon() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg
        viewBox="0 0 24 24"
        width="22"
        height="22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="3"
          y="7"
          width="18"
          height="13"
          rx="2"
          stroke="#ffffff"
          strokeWidth="1.8"
        />

        <path
          d="M8 7V5.5C8 4.67 8.67 4 9.5 4H14.5C15.33 4 16 4.67 16 5.5V7"
          stroke="#ffffff"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        <path
          d="M3 12H21"
          stroke="#ffffff"
          strokeWidth="1.8"
        />

        <path
          d="M10 12V13C10 13.55 10.45 14 11 14H13C13.55 14 14 13.55 14 13V12"
          stroke="#ffffff"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    </span>
  )
}

export default function App() {
  const [applications, setApplications] = useState([])
  const [stats, setStats] = useState([])
  const [filter, setFilter] = useState('')
  const [editingApplication, setEditingApplication] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadData = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const [apps, statCounts] = await Promise.all([
        getApplications(filter || undefined),
        getStats(),
      ])

      setApplications(apps)
      setStats(statCounts)
    } catch (err) {
      setError(
        'Could not reach the API. Make sure the FastAPI server is running on port 8000.'
      )
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleCreate = async (data) => {
    await createApplication(data)
    await loadData()
  }

  const handleUpdate = async (id, data) => {
    await updateApplication(id, data)
    setEditingApplication(null)
    await loadData()
  }

  const handleDelete = async (id) => {
    await deleteApplication(id)
    await loadData()
  }

  const countFor = (status) =>
    stats.find((s) => s.status === status)?.count ?? 0

  const total = stats.reduce((sum, s) => sum + s.count, 0)

  const activeCount =
    countFor('Applied') + countFor('Interview')

  const successRate = total
    ? Math.round((countFor('Offer') / total) * 100)
    : 0

  const pageTitle = useMemo(() => {
    if (!filter) return 'Your job search, organized.'
    return `${filter} applications`
  }, [filter])

  return (
    <div className="app-shell">

      {/* HEADER */}
      <header className="topbar">
        <div className="topbar-inner">

          <div className="brand">
            <SparkleIcon />

            <div>
              <strong>CareerTrack</strong>
              <span>Job application tracker</span>
            </div>
          </div>

          <div className="topbar-status">
            <span className="status-dot" />
            API connected
          </div>

        </div>
      </header>


      <main className="page">

        {/* HERO */}
       <div className="hero-content">

  <div className="hero-icon" aria-hidden="true">
    <svg
      width="38"
      height="38"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="3"
        y="7"
        width="18"
        height="13"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M8 7V5.5C8 4.67 8.67 4 9.5 4H14.5C15.33 4 16 4.67 16 5.5V7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M3 12H21"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M10 12V13C10 13.55 10.45 14 11 14H13C13.55 14 14 13.55 14 13V12"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  </div>

  <div>
    <span className="eyebrow">
      Career dashboard
    </span>

    <h1>{pageTitle}</h1>

    <p>
      Keep every application, interview and opportunity
      in one calm, focused workspace.
    </p>
  </div>

</div>


        {/* ERROR */}
        {error && (
          <div className="banner banner-error">
            {error}
          </div>
        )}


        {/* STATISTICS */}
        <section
          className="metrics-grid"
          aria-label="Application statistics"
        >

          <div className="metric-card metric-total">

            <div className="metric-icon">
              ▦
            </div>

            <div>
              <span>Total applications</span>
              <strong>{total}</strong>
            </div>

            <small>All time</small>

          </div>


          <div className="metric-card">

            <div className="metric-icon blue">
              ↗
            </div>

            <div>
              <span>Active pipeline</span>
              <strong>{activeCount}</strong>
            </div>

            <small>
              Applied + interview
            </small>

          </div>


          <div className="metric-card">

            <div className="metric-icon green">
              ✓
            </div>

            <div>
              <span>Offers</span>
              <strong>
                {countFor('Offer')}
              </strong>
            </div>

            <small>
              {successRate}% of applications
            </small>

          </div>


          <div className="metric-card">

            <div className="metric-icon red">
              ×
            </div>

            <div>
              <span>Rejected</span>
              <strong>
                {countFor('Rejected')}
              </strong>
            </div>

            <small>
              Keep going
            </small>

          </div>

        </section>


        {/* FILTER */}
        <section className="filter-bar">

          <div>

            <span className="section-kicker">
              Pipeline
            </span>

            <strong>
              Filter by status
            </strong>

          </div>


          <div className="status-filters">

            <button
              type="button"
              className={`filter-chip ${
                !filter ? 'selected' : ''
              }`}
              onClick={() => setFilter('')}
            >
              All
              <b>{total}</b>
            </button>


            {STATUSES.map((status) => (

              <button
                key={status}
                type="button"
                className={`filter-chip ${
                  filter === status ? 'selected' : ''
                }`}
                onClick={() =>
                  setFilter(
                    filter === status ? '' : status
                  )
                }
              >

                <span
                  className={`mini-dot dot-${status.toLowerCase()}`}
                />

                {STATUS_META[status].label}

                <b>
                  {countFor(status)}
                </b>

              </button>

            ))}

          </div>

        </section>


        {/* DASHBOARD */}
        <div className="dashboard-grid">

          <section className="main-column">

            <ApplicationList
              applications={applications}
              loading={loading}
              filter={filter}
              onEdit={setEditingApplication}
              onDelete={handleDelete}
            />

          </section>


          <aside className="side-column">

            <ApplicationForm
              id="application-form"
              statuses={STATUSES}
              initialData={editingApplication}
              onSubmit={
                editingApplication
                  ? (data) =>
                      handleUpdate(
                        editingApplication.id,
                        data
                      )
                  : handleCreate
              }
              onCancel={
                editingApplication
                  ? () =>
                      setEditingApplication(null)
                  : undefined
              }
            />

            <StatusChart
              stats={stats}
              statuses={STATUSES}
            />

          </aside>

        </div>

      </main>

    </div>
  )
}
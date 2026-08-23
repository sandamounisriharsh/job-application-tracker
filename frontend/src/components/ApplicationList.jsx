const STATUS_CLASS = {
  Applied: 'status-applied',
  Interview: 'status-interview',
  Offer: 'status-offer',
  Rejected: 'status-rejected',
}

const STATUS_ICON = {
  Applied: '↗',
  Interview: '◎',
  Offer: '✓',
  Rejected: '×',
}

function getInitials(company = '') {
  return company
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

function formatDate(date) {
  if (!date) return ''

  const parsed = new Date(`${date}T00:00:00`)

  if (Number.isNaN(parsed.getTime())) {
    return date
  }

  return parsed.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function ApplicationList({
  applications,
  loading,
  filter,
  onEdit,
  onDelete,
}) {
  if (loading) {
    return (
      <div className="card empty-state">
        <p>Loading applications…</p>
        <p className="muted">Getting your latest job applications.</p>
      </div>
    )
  }

  if (applications.length === 0) {
    return (
      <div className="card empty-state">
        <p>
          {filter
            ? `No applications marked "${filter}" yet.`
            : 'No applications logged yet.'}
        </p>

        <p className="muted">
          Add your first job application to start tracking your progress.
        </p>
      </div>
    )
  }

  return (
    <div className="card list-card">

      {/* HEADER */}
      <div className="list-header">
        <div>
          <span className="section-kicker">Applications</span>

          <h2>
            {filter
              ? `${filter} applications`
              : 'All applications'}
          </h2>
        </div>

        <span className="application-count">
          {applications.length}{' '}
          {applications.length === 1
            ? 'application'
            : 'applications'}
        </span>
      </div>


      {/* APPLICATIONS */}
      <div className="app-list">

        {applications.map((app) => (

          <div className="app-row" key={app.id}>

            {/* COMPANY */}
            <div className="app-main">

              <div className="company-avatar">
                {getInitials(app.company)}
              </div>

              <div className="company-info">
                <p className="app-company">
                  {app.company}
                </p>

                <p className="app-role">
                  {app.role}
                </p>
              </div>

            </div>


            {/* STATUS */}
            <div className="app-meta">

              <span
                className={`status-badge ${
                  STATUS_CLASS[app.status] || ''
                }`}
              >
                <span>
                  {STATUS_ICON[app.status]}
                </span>

                {app.status}
              </span>

              <span className="app-date">
                {formatDate(app.applied_date)}
              </span>

            </div>


            {/* NOTES */}
            {app.notes && (

              <div className="app-notes">

                <span className="notes-label">
                  Notes
                </span>

                <p>{app.notes}</p>

              </div>

            )}


            {/* ACTION BUTTONS */}
            <div className="app-actions">

              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => onEdit(app)}
              >
                ✎ Edit
              </button>

              <button
                type="button"
                className="btn btn-ghost btn-sm btn-danger"
                onClick={() => {
                  const confirmed = window.confirm(
                    `Delete your application for ${app.role} at ${app.company}?`
                  )

                  if (confirmed) {
                    onDelete(app.id)
                  }
                }}
              >
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  )
}
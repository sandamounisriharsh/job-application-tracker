import { useEffect, useState } from 'react'

const EMPTY = {
  company: '',
  role: '',
  status: 'Applied',
  applied_date: new Date().toISOString().slice(0, 10),
  notes: '',
}

export default function ApplicationForm({
  statuses,
  initialData,
  onSubmit,
  onCancel,
}) {
  const [form, setForm] = useState(initialData ?? EMPTY)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setForm(initialData ?? EMPTY)
  }, [initialData])

  const handleChange = (field) => (e) => {
    setForm({
      ...form,
      [field]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setSubmitting(true)

    try {
      await onSubmit(form)

      if (!initialData) {
        setForm({
          ...EMPTY,
          applied_date: new Date()
            .toISOString()
            .slice(0, 10),
        })
      }
    } finally {
      setSubmitting(false)
    }
  }

  const isEditing = Boolean(initialData)

  return (
    <form
      id="application-form"
      className="card form-card"
      onSubmit={handleSubmit}
    >

      {/* FORM HEADER */}
      <div className="form-header">

        <div className="form-icon">
          {isEditing ? '✎' : '+'}
        </div>

        <div>
          <span className="section-kicker">
            {isEditing ? 'Update' : 'New entry'}
          </span>

          <h2>
            {isEditing
              ? 'Edit application'
              : 'Log an application'}
          </h2>
        </div>

      </div>


      {/* COMPANY */}
      <label>
        Company

        <input
          required
          value={form.company}
          onChange={handleChange('company')}
          placeholder="e.g. Microsoft"
          autoComplete="organization"
        />
      </label>


      {/* ROLE */}
      <label>
        Job role

        <input
          required
          value={form.role}
          onChange={handleChange('role')}
          placeholder="e.g. Software Engineer Intern"
        />
      </label>


      {/* STATUS + DATE */}
      <div className="field-row">

        <label>
          Status

          <select
            value={form.status}
            onChange={handleChange('status')}
          >
            {statuses.map((status) => (
              <option
                key={status}
                value={status}
              >
                {status}
              </option>
            ))}
          </select>
        </label>


        <label>
          Applied on

          <input
            type="date"
            required
            value={form.applied_date}
            onChange={handleChange('applied_date')}
          />
        </label>

      </div>


      {/* NOTES */}
      <label>
        Notes

        <textarea
          rows={4}
          value={form.notes ?? ''}
          onChange={handleChange('notes')}
          placeholder="Referral, recruiter contact, interview details..."
        />

        <span className="field-hint">
          Add anything useful for your follow-up.
        </span>
      </label>


      {/* ACTIONS */}
      <div className="form-actions">

        <button
          type="submit"
          className="btn btn-primary form-submit"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <span className="button-spinner" />
              Saving...
            </>
          ) : (
            <>
              {isEditing ? '✓ Save changes' : '+ Add application'}
            </>
          )}
        </button>


        {onCancel && (
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </button>
        )}

      </div>

    </form>
  )
}
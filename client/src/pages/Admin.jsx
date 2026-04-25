import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { addJob, deleteJob, getJobs, updateJob } from '../lib/api';
import { toLocalIsoDate } from '../lib/date';
import { validateJobFormFields } from '../lib/validation';
import JobCard from '../components/JobCard';
import SkeletonCard from '../components/SkeletonCard';

function getDefaultForm() {
  return {
    company: '',
    role: '',
    url: '',
    date_applied: toLocalIsoDate(new Date()),
    status: 'Applied',
  };
}

export default function Admin() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(() => getDefaultForm());
  const [formErrors, setFormErrors] = useState({});
  const [addApiError, setAddApiError] = useState('');
  const [editId, setEditId] = useState(null);
  const [editErrors, setEditErrors] = useState({});
  const [editApiError, setEditApiError] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        const jobsData = await getJobs();
        if (!active) {
          return;
        }
        setJobs(jobsData);
      } catch (err) {
        if (active) {
          setError(err.message || 'Could not load admin data.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  function updateFormField(partial) {
    setForm((current) => ({ ...current, ...partial }));
    const key = Object.keys(partial)[0];
    if (key) {
      setFormErrors((e) => ({ ...e, [key]: '' }));
    }
    setAddApiError('');
  }

  async function handleAdd(event) {
    event.preventDefault();
    setAddApiError('');
    setError('');

    const nextErrors = validateJobFormFields(form);
    if (Object.keys(nextErrors).length) {
      setFormErrors(nextErrors);
      return;
    }
    setFormErrors({});

    setSaving(true);
    try {
      const created = await addJob(form);
      setJobs((current) => [created, ...current]);
      setForm(getDefaultForm());
    } catch (err) {
      setAddApiError(err.message || 'Could not add job.');
    } finally {
      setSaving(false);
    }
  }

  async function handleEditSave(job) {
    setEditApiError('');

    const nextErrors = validateJobFormFields(job);
    if (Object.keys(nextErrors).length) {
      setEditErrors(nextErrors);
      return;
    }
    setEditErrors({});

    setSaving(true);
    try {
      const updated = await updateJob(job.id, job);
      setJobs((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      setEditId(null);
    } catch (err) {
      setEditApiError(err.message || 'Could not update job.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(job) {
    if (confirmDeleteId !== job.id) {
      setConfirmDeleteId(job.id);
      return;
    }

    setSaving(true);
    setError('');
    try {
      await deleteJob(job.id);
      setJobs((current) => current.filter((item) => item.id !== job.id));
      setConfirmDeleteId(null);
    } catch (err) {
      setError(err.message || 'Could not delete job.');
    } finally {
      setSaving(false);
    }
  }

  const isEditing = useMemo(() => editId !== null, [editId]);

  return (
    <div className="app-shell">
      <div className="page stack">
        <div className="admin-header">
          <div>
            <h1 className="page-title" style={{ marginBottom: 4 }}>
              track.it
            </h1>
            <div className="admin-badge">admin</div>
          </div>
        </div>

        {error ? <div className="error-banner">{error}</div> : null}

        <section className="stack">
          <h2 className="chart-title">Add application</h2>
          <form className="card stat-card form-grid" onSubmit={handleAdd} noValidate>
            <div className="form-field">
              <input
                className={`input${formErrors.company ? ' error' : ''}`}
                placeholder="Company name"
                value={form.company}
                onChange={(e) => updateFormField({ company: e.target.value })}
                autoComplete="organization"
                aria-invalid={!!formErrors.company}
              />
              {formErrors.company ? <p className="field-error">{formErrors.company}</p> : null}
            </div>
            <div className="form-field">
              <input
                className={`input${formErrors.role ? ' error' : ''}`}
                placeholder="Role"
                value={form.role}
                onChange={(e) => updateFormField({ role: e.target.value })}
                autoComplete="off"
                aria-invalid={!!formErrors.role}
              />
              {formErrors.role ? <p className="field-error">{formErrors.role}</p> : null}
            </div>
            <div className="form-field">
              <input
                className={`input${formErrors.url ? ' error' : ''}`}
                placeholder="Job posting URL"
                type="url"
                inputMode="url"
                value={form.url}
                onChange={(e) => updateFormField({ url: e.target.value })}
                autoComplete="url"
                aria-invalid={!!formErrors.url}
              />
              {formErrors.url ? <p className="field-error">{formErrors.url}</p> : null}
            </div>
            <div className="form-field">
              <input
                className={`input${formErrors.date_applied ? ' error' : ''}`}
                type="date"
                value={form.date_applied}
                onChange={(e) => updateFormField({ date_applied: e.target.value })}
                aria-invalid={!!formErrors.date_applied}
              />
              {formErrors.date_applied ? <p className="field-error">{formErrors.date_applied}</p> : null}
            </div>
            <select className="select" value={form.status} onChange={(e) => updateFormField({ status: e.target.value })}>
              <option>Applied</option>
              <option>Interview</option>
              <option>Offer</option>
              <option>Rejected</option>
            </select>
            <button className="button primary" type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Log application'}
            </button>
            {addApiError ? <p className="field-error" style={{ margin: 0 }}>{addApiError}</p> : null}
          </form>
        </section>

        <section className="stack">
          <h2 className="chart-title">Your applications</h2>
          <div className="jobs-list">
            {loading ? (
              <>
                <SkeletonCard height={104} />
                <SkeletonCard height={104} />
              </>
            ) : jobs.length ? (
              <AnimatePresence initial={false}>
                {jobs.map((job) => (
                  <motion.div
                    key={job.id}
                    layout
                    className="stack"
                    initial={false}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  >
                    {editId === job.id ? (
                      <form
                        className="card stat-card form-grid"
                        onSubmit={(event) => {
                          event.preventDefault();
                          handleEditSave(job);
                        }}
                        noValidate
                      >
                        <div className="form-field">
                          <input
                            className={`input${editErrors.company ? ' error' : ''}`}
                            value={job.company}
                            onChange={(e) => {
                              setEditErrors({});
                              setEditApiError('');
                              setJobs((current) => current.map((item) => (item.id === job.id ? { ...item, company: e.target.value } : item)));
                            }}
                            aria-invalid={!!editErrors.company}
                          />
                          {editErrors.company ? <p className="field-error">{editErrors.company}</p> : null}
                        </div>
                        <div className="form-field">
                          <input
                            className={`input${editErrors.role ? ' error' : ''}`}
                            value={job.role}
                            onChange={(e) => {
                              setEditErrors({});
                              setEditApiError('');
                              setJobs((current) => current.map((item) => (item.id === job.id ? { ...item, role: e.target.value } : item)));
                            }}
                            aria-invalid={!!editErrors.role}
                          />
                          {editErrors.role ? <p className="field-error">{editErrors.role}</p> : null}
                        </div>
                        <div className="form-field">
                          <input
                            className={`input${editErrors.url ? ' error' : ''}`}
                            type="url"
                            value={job.url}
                            onChange={(e) => {
                              setEditErrors({});
                              setEditApiError('');
                              setJobs((current) => current.map((item) => (item.id === job.id ? { ...item, url: e.target.value } : item)));
                            }}
                            aria-invalid={!!editErrors.url}
                          />
                          {editErrors.url ? <p className="field-error">{editErrors.url}</p> : null}
                        </div>
                        <div className="form-field">
                          <input
                            className={`input${editErrors.date_applied ? ' error' : ''}`}
                            type="date"
                            value={job.date_applied}
                            onChange={(e) => {
                              setEditErrors({});
                              setEditApiError('');
                              setJobs((current) => current.map((item) => (item.id === job.id ? { ...item, date_applied: e.target.value } : item)));
                            }}
                            aria-invalid={!!editErrors.date_applied}
                          />
                          {editErrors.date_applied ? <p className="field-error">{editErrors.date_applied}</p> : null}
                        </div>
                        <select
                          className="select"
                          value={job.status}
                          onChange={(e) => {
                            setEditErrors({});
                            setEditApiError('');
                            setJobs((current) => current.map((item) => (item.id === job.id ? { ...item, status: e.target.value } : item)));
                          }}
                        >
                          <option>Applied</option>
                          <option>Interview</option>
                          <option>Offer</option>
                          <option>Rejected</option>
                        </select>
                        <div className="form-actions">
                          <button className="button primary" type="submit" disabled={saving}>
                            {saving ? 'Saving...' : 'Save'}
                          </button>
                          <button
                            className="button outline"
                            type="button"
                            onClick={() => {
                              setEditId(null);
                              setEditErrors({});
                              setEditApiError('');
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                        {editApiError ? <p className="field-error" style={{ margin: 0 }}>{editApiError}</p> : null}
                      </form>
                    ) : (
                      <JobCard
                        job={job}
                        isAdmin
                        onEdit={() => {
                          setEditId(job.id);
                          setEditErrors({});
                          setEditApiError('');
                        }}
                        onDelete={() => handleDelete(job)}
                      />
                    )}

                    {confirmDeleteId === job.id ? (
                      <div className="card stat-card">
                        <div style={{ marginBottom: 12 }}>Delete this application?</div>
                        <div className="form-actions">
                          <button className="button primary" type="button" onClick={() => handleDelete(job)} disabled={saving}>
                            {saving ? 'Deleting...' : 'Yes, delete'}
                          </button>
                          <button className="button outline" type="button" onClick={() => setConfirmDeleteId(null)}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </motion.div>
                ))}
              </AnimatePresence>
            ) : (
              <div className="card empty-state">
                <div>No applications logged.</div>
                <div>Add your first one above.</div>
              </div>
            )}
          </div>
        </section>

        {isEditing ? <div style={{ height: 24 }} /> : null}
      </div>
    </div>
  );
}

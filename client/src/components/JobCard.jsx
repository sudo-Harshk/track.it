import { ExternalLink, Pencil, Trash2 } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { formatDate } from '../lib/date';

export default function JobCard({ job, isAdmin = false, onEdit, onDelete }) {
  return (
    <article className="card job-card" aria-label={`${job.company} — ${job.role}`}>
      <div className="job-top">
        <div>
          <h2 className="job-company">{job.company}</h2>
          <p className="job-role">{job.role}</p>
        </div>
        <StatusBadge status={job.status} />
      </div>

      <div className="job-bottom" style={{ marginTop: 14 }}>
        <p className="job-date">
          <span className="sr-only">Applied on </span>
          {formatDate(job.date_applied)}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <a
            className="link-accent"
            href={job.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`View job posting for ${job.role} at ${job.company} (opens in new tab)`}
          >
            View posting <ExternalLink size={14} strokeWidth={1.5} aria-hidden="true" />
          </a>
          {isAdmin ? (
            <>
              <button
                className="button ghost"
                type="button"
                onClick={() => onEdit?.(job)}
                aria-label={`Edit ${job.role} at ${job.company}`}
              >
                <Pencil size={16} aria-hidden="true" />
              </button>
              <button
                className="button ghost"
                type="button"
                onClick={() => onDelete?.(job)}
                aria-label={`Delete ${job.role} at ${job.company}`}
              >
                <Trash2 size={16} aria-hidden="true" />
              </button>
            </>
          ) : null}
        </div>
      </div>
    </article>
  );
}

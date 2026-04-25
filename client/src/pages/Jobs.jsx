import { useMemo, useState } from 'react';
import JobCard from '../components/JobCard';
import SkeletonCard from '../components/SkeletonCard';

const filters = ['All', 'Applied', 'Interview', 'Offer', 'Rejected'];

export default function Jobs({ jobs, loading }) {
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredJobs = useMemo(() => {
    if (activeFilter === 'All') {
      return jobs;
    }
    return jobs.filter((job) => job.status === activeFilter);
  }, [activeFilter, jobs]);

  const resultCount = filteredJobs.length;
  const resultLabel =
    activeFilter === 'All'
      ? `Showing all ${resultCount} application${resultCount !== 1 ? 's' : ''}`
      : `${resultCount} ${activeFilter} application${resultCount !== 1 ? 's' : ''}`;

  return (
    <div className="stack">
      <h1 className="page-title">Applications</h1>

      <div
        className="pill-row"
        role="group"
        aria-label="Filter applications by status"
      >
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            className={filter === activeFilter ? 'pill active' : 'pill'}
            aria-pressed={filter === activeFilter}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <div
        className="jobs-list"
        role="region"
        aria-label="Job applications"
        aria-live="polite"
        aria-atomic="false"
      >
        {loading ? (
          <>
            <SkeletonCard height={120} />
            <SkeletonCard height={120} />
            <SkeletonCard height={120} />
          </>
        ) : filteredJobs.length ? (
          <>
            <p className="sr-only" aria-live="polite">{resultLabel}</p>
            {filteredJobs.map((job) => <JobCard key={job.id} job={job} />)}
          </>
        ) : (
          <div className="card empty-state" role="status">
            <div>No applications yet.</div>
            <div>Check back soon.</div>
          </div>
        )}
      </div>
    </div>
  );
}

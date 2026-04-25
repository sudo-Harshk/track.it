import { useEffect, useState } from 'react';
import { getJobs } from '../lib/api';

export function useJobsData() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        setError('');
        const jobsResult = await getJobs();

        if (!active) {
          return;
        }

        setJobs(jobsResult);
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

  return { jobs, setJobs, loading, error, setError };
}


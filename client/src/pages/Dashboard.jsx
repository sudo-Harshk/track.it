import { motion } from 'framer-motion';
import ChartCard from '../components/ChartCard';
import HeroCard from '../components/HeroCard';
import SkeletonCard from '../components/SkeletonCard';
import StatCard from '../components/StatCard';
import { toLocalIsoDate } from '../lib/date';
import { getTodayQuote } from '../lib/quotes';

export default function Dashboard({ jobs, loading }) {
  const today = toLocalIsoDate(new Date());
  const thisMonth = today.slice(0, 7);
  const todayCount = jobs.filter((job) => job.date_applied === today).length;
  const monthCount = jobs.filter((job) => job.date_applied.startsWith(thisMonth)).length;
  const interviewCount = jobs.filter((job) => job.date_applied.startsWith(thisMonth) && job.status === 'Interview').length;

  return (
    <div className="stack">
      <div>
        <h1 className="page-title">Your job hunt</h1>
      </div>

      {loading ? <SkeletonCard height={180} /> : <HeroCard count={todayCount} quote={getTodayQuote()} />}

      <motion.div
        className="stats-grid"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.05,
            },
          },
        }}
      >
        <motion.div variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
          {loading ? <SkeletonCard height={110} /> : <StatCard label="This month" value={monthCount} hint="Applications logged" />}
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
          {loading ? <SkeletonCard height={110} /> : <StatCard label="Interviews" value={interviewCount} hint="This month" />}
        </motion.div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
        {loading ? <SkeletonCard height={220} /> : <ChartCard jobs={jobs} />}
      </motion.div>
    </div>
  );
}

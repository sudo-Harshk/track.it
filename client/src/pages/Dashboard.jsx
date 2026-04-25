import { motion } from 'framer-motion';
import ChartCard from '../components/ChartCard';
import HeroCard from '../components/HeroCard';
import SkeletonCard from '../components/SkeletonCard';
import StatCard from '../components/StatCard';
import { getGreeting, toLocalIsoDate } from '../lib/date';
import { getTodayQuote } from '../lib/quotes';

function getWeekData(jobs) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const now = new Date();
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
  const today = toLocalIsoDate(new Date());

  return days.map((day, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    const dateStr = toLocalIsoDate(date);
    return {
      day,
      count: jobs.filter((job) => job.date_applied === dateStr).length,
      isToday: dateStr === today,
    };
  });
}

export default function Dashboard({ jobs, loading }) {
  const today = toLocalIsoDate(new Date());
  const thisMonth = today.slice(0, 7);
  const todayCount = jobs.filter((job) => job.date_applied === today).length;
  const monthCount = jobs.filter((job) => job.date_applied.startsWith(thisMonth)).length;
  const interviewCount = jobs.filter((job) => job.date_applied.startsWith(thisMonth) && job.status === 'Interview').length;
  const weekData = getWeekData(jobs);

  return (
    <div className="stack">
      <div>
        <p className="greeting">{getGreeting()}</p>
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
        {loading ? <SkeletonCard height={220} /> : <ChartCard weekData={weekData} />}
      </motion.div>
    </div>
  );
}

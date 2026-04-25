import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import BottomNav from '../components/BottomNav';
import Dashboard from './Dashboard';
import Jobs from './Jobs';

export default function PublicLayout({ jobs, loading, error }) {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <div className="app-shell">
        <main id="main-content" className="page">
          <header className="brand-header" aria-label="track.it">
            <div>
              <p className="brand-name">track.it</p>
              <p className="brand-tagline">Personal job hunt tracker</p>
            </div>
          </header>
          {error ? (
            <div className="error-banner" role="alert" aria-live="assertive">
              {error}
            </div>
          ) : null}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {activeTab === 'dashboard' ? <Dashboard jobs={jobs} loading={loading} /> : null}
              {activeTab === 'jobs' ? <Jobs jobs={jobs} loading={loading} /> : null}
            </motion.div>
          </AnimatePresence>
        </main>
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </>
  );
}

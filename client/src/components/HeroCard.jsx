import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function HeroCard({ count, quote }) {
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 600;
    let frame = 0;

    function tick(now) {
      const progress = Math.min(1, (now - start) / duration);
      setDisplayCount(Math.round(count * progress));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [count]);

  return (
    <div className="hero-card">
      <p className="hero-label">Jobs applied today</p>
      <div className="hero-count">{displayCount}</div>
      <motion.p
        className="hero-quote"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        {quote}
      </motion.p>
    </div>
  );
}


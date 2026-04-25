import { AnimatePresence, motion } from 'framer-motion';

const classNames = {
  Applied: 'applied',
  Interview: 'interview',
  Offer: 'offer',
  Rejected: 'rejected',
};

export default function StatusBadge({ status }) {
  const className = classNames[status] || 'applied';

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={status}
        className={`badge ${className}`}
        role="img"
        aria-label={`Status: ${status}`}
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.05, 1] }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
      >
        {status}
      </motion.span>
    </AnimatePresence>
  );
}

export const quotes = [
  'Every application is a step forward.',
  'You only need one yes.',
  'Rejection is redirection.',
  'Progress, not perfection.',
  'The right door is still out there.',
  "Keep going - you're closer than you think.",
  'One application at a time.',
  'Showing up is already winning.',
  'Every no clears the path to yes.',
  'Your effort today is building tomorrow.',
];

export function getTodayQuote() {
  const start = new Date(new Date().getFullYear(), 0, 0);
  const diff = Date.now() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return quotes[dayOfYear % quotes.length];
}


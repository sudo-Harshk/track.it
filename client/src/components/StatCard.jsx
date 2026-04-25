export default function StatCard({ label, value, hint }) {
  return (
    <div className="card stat-card">
      <p className="stat-label">{label}</p>
      <div className="stat-value">{value}</div>
      <p className="stat-hint">{hint}</p>
    </div>
  );
}


import { Bar, BarChart, Cell, ResponsiveContainer, XAxis } from 'recharts';

export default function ChartCard({ weekData }) {
  return (
    <div className="card chart-card">
      <p className="chart-title">This week</p>
      <div style={{ width: '100%', height: 180 }}>
        <ResponsiveContainer>
          <BarChart data={weekData} margin={{ top: 0, right: 0, left: -12, bottom: 0 }}>
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#A8A29E', fontSize: 9 }} />
            <Bar dataKey="count" radius={[4, 4, 4, 4]}>
              {weekData.map((entry) => (
                <Cell key={entry.day} fill={entry.isToday ? '#C2622D' : '#E8DDD5'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

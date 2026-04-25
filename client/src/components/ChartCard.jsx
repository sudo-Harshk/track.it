import { cloneElement } from 'react';
import { ActivityCalendar } from 'react-activity-calendar';
import 'react-activity-calendar/tooltips.css';
import { toLocalIsoDate } from '../lib/date';

const calendarTheme = {
  light: ['#ffffff', '#efddd2', '#e4c2ae', '#d79f82', '#c57b57'],
  dark: ['#ffffff', '#efddd2', '#e4c2ae', '#d79f82', '#c57b57'],
};

function toActivityData(jobs) {
  const today = new Date();
  const endDate = new Date(today);
  endDate.setHours(12, 0, 0, 0);

  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 364);

  const countsByDate = new Map();
  for (const job of jobs) {
    if (!job?.date_applied) {
      continue;
    }
    countsByDate.set(job.date_applied, (countsByDate.get(job.date_applied) || 0) + 1);
  }

  let maxCount = 0;
  countsByDate.forEach((count) => {
    if (count > maxCount) {
      maxCount = count;
    }
  });

  const data = [];
  const cursor = new Date(startDate);
  while (cursor <= endDate) {
    const date = toLocalIsoDate(cursor);
    const count = countsByDate.get(date) || 0;
    const level = maxCount > 0 ? Math.min(4, Math.ceil((count / maxCount) * 4)) : 0;

    data.push({
      date,
      count,
      level,
    });

    cursor.setDate(cursor.getDate() + 1);
  }

  return data;
}

export default function ChartCard({ jobs }) {
  const data = toActivityData(jobs);
  return (
    <div className="card chart-card">
      <p className="chart-title">Application activity</p>
      <div className="calendar-shell">
        <ActivityCalendar
          data={data}
          weekStart={1}
          fontSize={12}
          blockSize={12}
          blockMargin={3}
          showColorLegend={false}
          showTotalCount
          renderBlock={(block) => cloneElement(block, {
            style: {
              ...block.props.style,
              stroke: '#000',
              strokeWidth: 1,
            },
          })}
          labels={{
            totalCount: '{{count}} applications in the last year',
            legend: {
              less: 'Less',
              more: 'More',
            },
          }}
          tooltips={{
            activity: {
              text: (activity) => `${activity.count} application${activity.count === 1 ? '' : 's'} on ${activity.date}`,
            },
          }}
          theme={calendarTheme}
        />
      </div>
    </div>
  );
}

import { LayoutGrid, List } from 'lucide-react';

const items = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
  { key: 'jobs', label: 'Jobs', icon: List },
];

export default function BottomNav({ activeTab, onTabChange }) {
  return (
    <nav className="bottom-nav" aria-label="Primary navigation">
      {items.map((item) => {
        const Icon = item.icon;
        const active = activeTab === item.key;

        return (
          <button
            key={item.key}
            type="button"
            className={active ? 'active' : ''}
            onClick={() => onTabChange(item.key)}
            aria-current={active ? 'page' : undefined}
            aria-label={item.label}
          >
            <Icon size={24} strokeWidth={1.5} aria-hidden="true" />
            <span>{item.label}</span>
            {active ? <span className="nav-dot" aria-hidden="true" /> : <span style={{ height: 4 }} aria-hidden="true" />}
          </button>
        );
      })}
    </nav>
  );
}

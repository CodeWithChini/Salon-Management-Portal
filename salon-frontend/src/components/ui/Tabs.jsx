export default function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex flex-wrap gap-1 border-b border-ink-100">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`relative px-4 py-2.5 text-sm font-medium transition-colors ${
            active === tab.value ? 'text-ink-800' : 'text-ink-400 hover:text-ink-600'
          }`}
        >
          {tab.label}
          {active === tab.value && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-brass-400" />}
        </button>
      ))}
    </div>
  );
}

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-ink-200 bg-stone-50 px-6 py-14 text-center">
      {Icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-ink-300">
          <Icon size={22} strokeWidth={1.5} />
        </div>
      )}
      <div>
        <p className="font-display text-lg text-ink-700">{title}</p>
        {description && <p className="mx-auto mt-1 max-w-sm text-sm text-ink-400">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export default function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <p className="mb-1 text-xs font-semibold text-brass-500">{eyebrow}</p>}
        <h1 className="font-display text-2xl font-semibold text-ink-800 sm:text-[1.7rem]">{title}</h1>
        {description && <p className="mt-1.5 max-w-xl text-sm text-ink-400">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}

export default function Table({ columns, children }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-ink-100">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-ink-100 bg-stone-50">
            {columns.map((col) => (
              <th
                key={col.key || col}
                className="whitespace-nowrap px-4 py-3 text-[0.72rem] font-semibold uppercase tracking-wide text-ink-400"
              >
                {col.label || col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100">{children}</tbody>
      </table>
    </div>
  );
}

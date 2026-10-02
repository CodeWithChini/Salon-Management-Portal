import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

const Select = forwardRef(function Select({ label, className = '', children, ...props }, ref) {
  return (
    <label className="block">
      {label && <span className="field-label">{label}</span>}
      <span className="relative block">
        <select ref={ref} className={`field appearance-none pr-9 ${className}`} {...props}>
          {children}
        </select>
        <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-400" />
      </span>
    </label>
  );
});

export default Select;

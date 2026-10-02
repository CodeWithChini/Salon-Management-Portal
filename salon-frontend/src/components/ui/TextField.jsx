import { forwardRef } from 'react';

const TextField = forwardRef(function TextField({ label, error, className = '', ...props }, ref) {
  return (
    <label className="block">
      {label && <span className="field-label">{label}</span>}
      <input ref={ref} className={`field ${error ? 'border-clay-400' : ''} ${className}`} {...props} />
      {error && <span className="mt-1 block text-xs text-clay-500">{error}</span>}
    </label>
  );
});

export default TextField;

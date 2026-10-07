'use client';

import { cn } from '~/lib/utils';

type Option = { value: string; label: string };

type Props = {
  id: string;
  label: string;
  value: string;
  options: Option[];
  required?: boolean;
  error?: string;
  onChange: (value: string) => void;
};

export function CustomSelect({ id, label, value, options, required, error, onChange }: Props) {
  return (
    <div className={cn('field', error && 'has-error')}>
      <label className="mb-2 block font-semibold" htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        className="field-input"
        value={value}
        required={required}
        aria-invalid={Boolean(error)}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">Choose one</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <p className="field-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

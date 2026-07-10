import { useState } from 'react';

function PasswordInput({ id, value, onChange, placeholder, required, minLength, name }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        id={id} // CRITICAL FIX: Now accepts ID for A11y label linking
        type={visible ? 'text' : 'password'}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        className="w-full px-4 py-3.5 pr-12 border border-ink/15 rounded-sm focus:outline-none focus:border-indigo focus:ring-1 focus:ring-indigo bg-bone/30 font-display text-sm text-ink transition-all"
      />
      <button
        type="button"
        onClick={() => setVisible(!visible)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-ink/40 hover:text-ink/80 transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo"
      >
        {visible ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )}
      </button>
    </div>
  );
}

export default PasswordInput;
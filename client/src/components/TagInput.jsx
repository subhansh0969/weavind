import { useState } from 'react';

function TagInput({ id, tags, onChange, placeholder }) {
  const [inputValue, setInputValue] = useState('');

  const addTag = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInputValue('');
  };

  const removeTag = (tagToRemove) => {
    onChange(tags.filter((t) => t !== tagToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-3">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1.5 bg-indigo/10 text-indigo px-3 py-1.5 rounded-full text-sm font-display border border-indigo/20 shadow-sm"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              aria-label={`Remove ${tag} tag`}
              className="w-5 h-5 flex items-center justify-center text-indigo/60 hover:text-madder hover:bg-madder/10 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-madder"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-3">
        <input
          id={id} // CRITICAL FIX: Accepts ID for A11y label linking
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 px-4 py-3.5 border border-ink/15 rounded-sm focus:outline-none focus:border-indigo focus:ring-1 focus:ring-indigo bg-white font-display text-sm text-ink transition-all"
        />
        <button
          type="button"
          onClick={addTag}
          className="px-6 py-3.5 bg-ink/5 text-ink/70 rounded-sm text-sm font-display uppercase tracking-widest hover:bg-ink/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo"
        >
          Add
        </button>
      </div>
    </div>
  );
}

export default TagInput;
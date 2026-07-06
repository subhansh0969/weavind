import { useState } from 'react';

function TagInput({ tags, onChange, placeholder }) {
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
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1.5 bg-indigo/10 text-indigo px-3 py-1.5 rounded-full text-sm font-display"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-indigo/60 hover:text-madder transition-colors"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 px-4 py-2.5 border border-ink/20 rounded-sm focus:outline-none focus:border-indigo bg-transparent text-sm"
        />
        <button
          type="button"
          onClick={addTag}
          className="px-4 py-2.5 bg-ink/5 text-ink/70 rounded-sm text-sm font-display hover:bg-ink/10 transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  );
}

export default TagInput;
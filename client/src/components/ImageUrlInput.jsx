import { useState } from 'react';

function ImageUrlInput({ images, onChange }) {
  const [inputValue, setInputValue] = useState('');

  const addImage = () => {
    const trimmed = inputValue.trim();
    if (trimmed) {
      onChange([...images, trimmed]);
      setInputValue('');
    }
  };

  const removeImage = (index) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div>
      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-3 mb-3">
          {images.map((url, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square bg-ink/5 rounded-sm overflow-hidden">
                <img
                  src={url}
                  alt={'Product ' + (index + 1)}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="hidden w-full h-full items-center justify-center text-ink/30 text-xs text-center px-2">
                  Invalid URL
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-madder text-white rounded-full flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <input
          type="url"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addImage();
            }
          }}
          placeholder="Paste image URL"
          className="flex-1 px-4 py-2.5 border border-ink/20 rounded-sm focus:outline-none focus:border-indigo bg-transparent text-sm"
        />
        <button
          type="button"
          onClick={addImage}
          className="px-4 py-2.5 bg-ink/5 text-ink/70 rounded-sm text-sm font-display hover:bg-ink/10 transition-colors"
        >
          Add
        </button>
      </div>
      <p className="font-display text-xs text-ink/40 mt-2">
        Tip: Upload images to a free host like imgur.com or postimages.org, then paste the direct image link here. Cloudinary integration coming soon.
      </p>
    </div>
  );
}

export default ImageUrlInput;
import { useState } from 'react';

function ImageUrlInput({ id, images, onChange }) {
  const [inputValue, setInputValue] = useState('');
  const [failedImages, setFailedImages] = useState(new Set()); // React-friendly error handling

  const addImage = () => {
    const trimmed = inputValue.trim();
    if (trimmed) {
      onChange([...images, trimmed]);
      setInputValue('');
      
      // Clear failure state for this URL if it existed previously
      if (failedImages.has(trimmed)) {
        setFailedImages(prev => {
          const newSet = new Set(prev);
          newSet.delete(trimmed);
          return newSet;
        });
      }
    }
  };

  const removeImage = (indexToRemove, urlToRemove) => {
    onChange(images.filter((_, i) => i !== indexToRemove));
    
    // Cleanup failure state
    if (failedImages.has(urlToRemove)) {
      setFailedImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(urlToRemove);
        return newSet;
      });
    }
  };

  const handleImageError = (url) => {
    setFailedImages(prev => {
      const newSet = new Set(prev);
      newSet.add(url);
      return newSet;
    });
  };

  return (
    <div>
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
          {images.map((url, index) => {
            const hasFailed = failedImages.has(url);
            
            return (
              <div key={`${url}-${index}`} className="relative group">
                <div className="aspect-[3/4] sm:aspect-square bg-bone/50 border border-ink/10 rounded-sm overflow-hidden flex items-center justify-center">
                  {!hasFailed ? (
                    <img
                      src={url}
                      alt={`Product variant ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={() => handleImageError(url)}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-ink/40 p-4 text-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                        <line x1="3" y1="3" x2="21" y2="21" className="stroke-madder" />
                      </svg>
                      <span className="text-[10px] uppercase tracking-widest font-display text-madder/70">Invalid URL</span>
                    </div>
                  )}
                </div>
                
                {/* Touch-friendly delete button: Visible on mobile, hover on desktop */}
                <button
                  type="button"
                  onClick={() => removeImage(index, url)}
                  aria-label={`Remove image ${index + 1}`}
                  className="absolute -top-2 -right-2 w-7 h-7 bg-madder text-white rounded-full flex items-center justify-center text-lg shadow-sm opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-madder sm:focus-visible:opacity-100"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          id={id} // CRITICAL FIX: Accepts ID for A11y label linking
          type="url"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addImage();
            }
          }}
          placeholder="Paste direct image URL (e.g. https://imgur.com/image.jpg)"
          className="flex-1 px-4 py-3.5 border border-ink/15 rounded-sm focus:outline-none focus:border-indigo focus:ring-1 focus:ring-indigo bg-white font-display text-sm text-ink transition-all"
        />
        <button
          type="button"
          onClick={addImage}
          className="px-8 py-3.5 bg-ink/5 text-ink/70 rounded-sm text-sm font-display uppercase tracking-widest hover:bg-ink/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo whitespace-nowrap"
        >
          Add Image
        </button>
      </div>
      
      <p className="font-display text-[10px] uppercase tracking-widest text-ink/40 mt-3 flex items-center gap-1.5">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        Ensure URLs end in .jpg, .png, or .webp
      </p>
    </div>
  );
}

export default ImageUrlInput;
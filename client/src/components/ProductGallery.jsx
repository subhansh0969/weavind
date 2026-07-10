import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function ProductGallery({ images, productName }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const hasImages = images && images.length > 0;

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  if (!hasImages) {
    return (
      <div className="aspect-[3/4] bg-ink/5 rounded-sm flex items-center justify-center border border-ink/5">
        <span className="font-display text-ink/30 uppercase tracking-widest text-xs">No Image Available</span>
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      {/* Thumbnails - Vertical on desktop */}
      {images.length > 1 && (
        <div className="hidden sm:flex flex-col gap-3 w-16 lg:w-20 flex-shrink-0">
          {images.map((url, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              aria-label={`View image ${i + 1}`}
              className={`aspect-[3/4] rounded-sm overflow-hidden border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-1 ${
                i === activeIndex
                  ? 'border-indigo shadow-sm'
                  : 'border-transparent opacity-60 hover:opacity-100 hover:border-ink/20'
              }`}
            >
              <img src={url} alt={`${productName} thumbnail ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Main image with zoom */}
      <div className="flex-1">
        <div
          className="relative aspect-[3/4] bg-bone/30 rounded-sm overflow-hidden cursor-zoom-in border border-ink/5"
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
          onClick={() => setLightboxOpen(true)}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={activeIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              src={images[activeIndex]}
              alt={productName}
              className="w-full h-full object-cover hidden sm:block"
              style={
                isZoomed
                  ? {
                      transform: 'scale(2)',
                      transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    }
                  : { transform: 'scale(1)' }
              }
            />
          </AnimatePresence>
          
          {/* Mobile: no hover zoom, tap to open lightbox */}
          <img
            src={images[activeIndex]}
            alt={productName}
            className="w-full h-full object-cover sm:hidden"
          />

          {/* Expand Icon Hint */}
          <div className="absolute top-4 right-4 w-8 h-8 bg-bone/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 sm:opacity-100 transition-opacity pointer-events-none group-hover:opacity-100 shadow-sm text-ink/70">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 3 21 3 21 9"></polyline>
              <polyline points="9 21 3 21 3 15"></polyline>
              <line x1="21" y1="3" x2="14" y2="10"></line>
              <line x1="3" y1="21" x2="10" y2="14"></line>
            </svg>
          </div>

          {images.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-ink/80 backdrop-blur-sm text-bone text-[10px] font-display px-2.5 py-1 rounded-sm sm:hidden tracking-wider shadow-sm">
              {activeIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnails - Horizontal on mobile */}
        {images.length > 1 && (
          <div className="flex sm:hidden gap-3 mt-4 overflow-x-auto custom-scrollbar pb-2">
            {images.map((url, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                aria-label={`View image ${i + 1}`}
                className={`w-16 h-20 flex-shrink-0 rounded-sm overflow-hidden border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-1 ${
                  i === activeIndex
                    ? 'border-indigo shadow-sm'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={url} alt={`${productName} thumbnail ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxOpen(false)}
            className="fixed inset-0 bg-ink/95 z-[100] flex items-center justify-center p-4 sm:p-8"
          >
            <button
              onClick={() => setLightboxOpen(false)}
              aria-label="Close image gallery"
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-bone/10 flex items-center justify-center text-bone hover:bg-bone/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bone"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <img
              src={images[activeIndex]}
              alt={productName}
              className="max-w-full max-h-full object-contain rounded-sm"
              onClick={(e) => e.stopPropagation()}
            />
            {images.length > 1 && (
              <div className="absolute bottom-8 flex gap-3">
                {images.map((url, i) => (
                  <button
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveIndex(i);
                    }}
                    aria-label={`Go to image ${i + 1}`}
                    className={`w-2.5 h-2.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-bone ${
                      i === activeIndex ? 'bg-bone scale-110' : 'bg-bone/40 hover:bg-bone/70'
                    }`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ProductGallery;
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
      <div className="aspect-[3/4] bg-ink/5 rounded-sm flex items-center justify-center">
        <span className="font-display text-ink/30">No Image</span>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      {/* Thumbnails - vertical on desktop */}
      {images.length > 1 && (
        <div className="hidden sm:flex flex-col gap-2 w-16 flex-shrink-0">
          {images.map((url, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={
                i === activeIndex
                  ? 'aspect-square rounded-sm overflow-hidden border-2 border-indigo'
                  : 'aspect-square rounded-sm overflow-hidden border border-ink/15 opacity-60 hover:opacity-100 transition-opacity'
              }
            >
              <img src={url} alt={productName + ' ' + (i + 1)} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Main image with zoom */}
      <div className="flex-1">
        <div
          className="relative aspect-[3/4] bg-ink/5 rounded-sm overflow-hidden cursor-zoom-in"
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
              transition={{ duration: 0.2 }}
              src={images[activeIndex]}
              alt={productName}
              className="w-full h-full object-cover hidden sm:block"
              style={
                isZoomed
                  ? {
                      transform: 'scale(2)',
                      transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    }
                  : {}
              }
            />
          </AnimatePresence>
          {/* Mobile: no hover zoom, just tap to open lightbox */}
          <img
            src={images[activeIndex]}
            alt={productName}
            className="w-full h-full object-cover sm:hidden"
          />

          {images.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-ink/70 text-bone text-xs font-display px-2 py-1 rounded-sm sm:hidden">
              {activeIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnails - horizontal on mobile */}
        {images.length > 1 && (
          <div className="flex sm:hidden gap-2 mt-3 overflow-x-auto">
            {images.map((url, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={
                  i === activeIndex
                    ? 'w-14 h-14 flex-shrink-0 rounded-sm overflow-hidden border-2 border-indigo'
                    : 'w-14 h-14 flex-shrink-0 rounded-sm overflow-hidden border border-ink/15 opacity-60'
                }
              >
                <img src={url} alt={productName + ' ' + (i + 1)} className="w-full h-full object-cover" />
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
            className="fixed inset-0 bg-ink/95 z-[100] flex items-center justify-center p-6"
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-6 right-6 text-bone text-3xl font-display"
            >
              ×
            </button>
            <img
              src={images[activeIndex]}
              alt={productName}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            {images.length > 1 && (
              <div className="absolute bottom-6 flex gap-2">
                {images.map((url, i) => (
                  <button
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveIndex(i);
                    }}
                    className={
                      i === activeIndex
                        ? 'w-2 h-2 rounded-full bg-bone'
                        : 'w-2 h-2 rounded-full bg-bone/30'
                    }
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
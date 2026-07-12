import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const SLIDES = [
  {
    tag: 'Made in India · Made for the World',
    heading: 'Woven with care, worn everywhere.',
    cta: 'Explore Collection',
    ctaLink: '#collection',
    bg: 'bg-bone',
    text: 'text-ink',
    accent: '#A8412F',
  },
  {
    tag: 'New This Season',
    heading: 'Fresh threads for every story you wear.',
    cta: 'Shop New Arrivals',
    ctaLink: '/?sort=newest',
    bg: 'bg-indigo',
    text: 'text-bone',
    accent: '#C9A24B',
  },
  {
    tag: 'Limited Time',
    heading: 'Craft you can feel, prices you will love.',
    cta: 'See the Sale',
    ctaLink: '#collection',
    bg: 'bg-madder',
    text: 'text-bone',
    accent: '#F5F0E6',
  },
  {
    tag: 'Everyday Essentials',
    heading: 'Simple clothes for a complicated world.',
    cta: 'Shop Essentials',
    ctaLink: '/?category=Unisex',
    bg: 'bg-ink',
    text: 'text-bone',
    accent: '#C9A24B',
  },
];

const SLIDE_DURATION = 5500;
const SWIPE_THRESHOLD = 60;

function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const containerRef = useRef(null);

  const goTo = useCallback((newIndex, dir) => {
    setDirection(dir);
    setIndex((newIndex + SLIDES.length) % SLIDES.length);
    setProgressKey((k) => k + 1);
  }, []);

  const next = useCallback(() => goTo(index + 1, 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1, -1), [goTo, index]);

  useEffect(() => {
    if (paused) return;
    const timer = setTimeout(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % SLIDES.length);
      setProgressKey((k) => k + 1);
    }, SLIDE_DURATION);
    return () => clearTimeout(timer);
  }, [index, paused]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [next, prev]);

  const handleDragEnd = (e, info) => {
    if (info.offset.x < -SWIPE_THRESHOLD) next();
    else if (info.offset.x > SWIPE_THRESHOLD) prev();
  };

  const handleCtaClick = (e, link) => {
    if (link.startsWith('#')) {
      e.preventDefault();
      document.querySelector(link)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const slide = SLIDES[index];
  const isDark = slide.text === 'text-bone';

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative overflow-hidden select-none"
    >
      <AnimatePresence mode="wait" custom={direction}>
        <motion.section
          key={index}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={handleDragEnd}
          className={`relative ${slide.bg} ${slide.text} transition-colors duration-700 cursor-grab active:cursor-grabbing`}
        >
          <motion.div
            aria-hidden="true"
            animate={{
              x: [0, 30, -10, 0],
              y: [0, -20, 15, 0],
            }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
            className="pointer-events-none absolute -right-24 -top-24 w-96 h-96 rounded-full opacity-[0.08] blur-3xl"
            style={{ background: slide.accent }}
          />
          <motion.div
            aria-hidden="true"
            animate={{
              x: [0, -20, 15, 0],
              y: [0, 15, -10, 0],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
            className="pointer-events-none absolute -left-16 bottom-0 w-72 h-72 rounded-full opacity-[0.06] blur-3xl"
            style={{ background: slide.accent }}
          />

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-20 sm:pb-24">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-display uppercase tracking-[0.2em] text-xs mb-4"
              style={{ color: slide.accent }}
            >
              {slide.tag}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18 }}
              className="font-body text-4xl sm:text-5xl md:text-7xl leading-[1.05] max-w-2xl"
            >
              {slide.heading}
            </motion.h1>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              style={{ transformOrigin: 'left', background: slide.accent }}
              className="h-[2px] w-32 mt-8"
            />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-8"
            >
              <Link
                to={slide.ctaLink}
                onClick={(e) => handleCtaClick(e, slide.ctaLink)}
                className={
                  isDark
                    ? 'inline-flex items-center gap-2 px-6 py-3 bg-bone text-ink font-display uppercase tracking-wide text-sm rounded-sm hover:opacity-90 transition-opacity'
                    : 'inline-flex items-center gap-2 px-6 py-3 bg-ink text-bone font-display uppercase tracking-wide text-sm rounded-sm hover:bg-indigo transition-colors'
                }
              >
                {slide.cta}
                <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>
                  →
                </motion.span>
              </Link>
            </motion.div>
          </div>
        </motion.section>
      </AnimatePresence>

      <button
        onClick={prev}
        aria-label="Previous slide"
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-bone/20 backdrop-blur-sm items-center justify-center text-current opacity-0 hover:opacity-100 group-hover:opacity-60 transition-opacity z-10"
        style={{ color: isDark ? '#F5F0E6' : '#161616' }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-bone/20 backdrop-blur-sm items-center justify-center opacity-60 hover:opacity-100 transition-opacity z-10"
        style={{ color: isDark ? '#F5F0E6' : '#161616' }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i, i > index ? 1 : -1)}
            aria-label={'Go to slide ' + (i + 1)}
            className="relative w-8 h-1.5 rounded-full overflow-hidden bg-current opacity-30"
            style={{ color: isDark ? '#F5F0E6' : '#161616' }}
          >
            {i === index && !paused && (
              <motion.span
                key={progressKey}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: SLIDE_DURATION / 1000, ease: 'linear' }}
                className="absolute inset-y-0 left-0 bg-current opacity-100"
                style={{ color: isDark ? '#F5F0E6' : '#161616' }}
              />
            )}
            {i === index && paused && (
              <span className="absolute inset-0 bg-current opacity-100" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default HeroCarousel;
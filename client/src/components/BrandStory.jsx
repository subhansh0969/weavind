import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const STORY_SLIDES = [
  {
    tag: 'Our Craft',
    heading: 'Every thread carries a story of hands that wove it.',
    body: 'We work directly with weavers and small ateliers to bring you clothing that respects craft and never compromises on quality.',
  },
  {
    tag: 'Our Fabric',
    heading: 'Dyes drawn from the earth of India.',
    body: 'Natural indigo, madder, and turmeric — colors rooted in centuries of textile tradition, reimagined for today.',
  },
  {
    tag: 'Our Promise',
    heading: 'Fair pay, honest prices, no compromise.',
    body: 'Every artisan we work with is paid fairly. Every price you see is honest. That is the Weavind way.',
  },
];

const SLIDE_DURATION = 4500;

function BrandStory() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setIndex((prev) => (prev + 1) % STORY_SLIDES.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [next, paused]);

  const slide = STORY_SLIDES[index];

  return (
    <section
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative overflow-hidden bg-indigo text-bone py-14 sm:py-16 my-4"
    >
      <motion.div
        aria-hidden="true"
        animate={{ x: [0, 30, -10, 0], y: [0, -20, 15, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -right-20 -top-20 w-72 h-72 rounded-full opacity-[0.07] blur-3xl"
        style={{ background: '#C9A24B' }}
      />
      <motion.div
        aria-hidden="true"
        animate={{ x: [0, -25, 15, 0], y: [0, 20, -10, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -left-16 -bottom-16 w-64 h-64 rounded-full opacity-[0.06] blur-3xl"
        style={{ background: '#A8412F' }}
      />

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center min-h-[220px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <p className="font-display uppercase tracking-[0.2em] text-xs text-gold mb-4">
              {slide.tag}
            </p>
            <h2 className="font-body text-xl sm:text-2xl md:text-3xl leading-snug mb-4">
              {slide.heading}
            </h2>
            <p className="text-bone/70 leading-relaxed text-sm max-w-lg mx-auto">
              {slide.body}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative flex justify-center gap-2 mt-6">
        {STORY_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={'Go to story ' + (i + 1)}
            className={
              i === index
                ? 'w-5 h-1.5 rounded-full bg-gold transition-all'
                : 'w-1.5 h-1.5 rounded-full bg-bone/30 hover:bg-bone/50 transition-all'
            }
          />
        ))}
      </div>

      <div className="relative text-center mt-6">
        <Link
          to="/about"
          className="group inline-flex items-center gap-2 font-display uppercase tracking-wide text-xs border-b border-gold text-gold pb-1 hover:text-bone hover:border-bone transition-colors"
        >
          Read Our Full Story
          <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>
            →
          </motion.span>
        </Link>
      </div>
    </section>
  );
}

export default BrandStory;
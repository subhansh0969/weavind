import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CATEGORIES = [
  {
    name: 'Men',
    slug: 'Men',
    tagline: 'Tailored essentials',
    gradient: 'from-indigo to-ink',
  },
  {
    name: 'Women',
    slug: 'Women',
    tagline: 'Effortless elegance',
    gradient: 'from-madder to-ink',
  },
  {
    name: 'Kids',
    slug: 'Kids',
    tagline: 'Playful comfort',
    gradient: 'from-gold to-madder',
  },
  {
    name: 'Unisex',
    slug: 'Unisex',
    tagline: 'For everyone',
    gradient: 'from-ink to-indigo',
  },
];

function CategoryTiles() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="font-display uppercase tracking-wide text-sm text-ink/50 mb-6 sm:mb-8"
      >
        Shop by Category
      </motion.p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {CATEGORIES.map((cat, i) => (
          <motion.div
            key={cat.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
          >
            <Link
              to={`/?category=${cat.slug}`}
              className={`group relative flex flex-col items-center justify-center aspect-[4/5] rounded-sm overflow-hidden bg-gradient-to-br ${cat.gradient}`}
            >
              <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/10 transition-colors duration-300" />
              <span className="font-body text-2xl sm:text-3xl text-bone mb-1 relative z-10 group-hover:scale-105 transition-transform duration-300">
                {cat.name}
              </span>
              <span className="font-display text-[10px] sm:text-xs uppercase tracking-wide text-bone/70 relative z-10">
                {cat.tagline}
              </span>
              <span className="absolute bottom-4 font-display text-[10px] uppercase tracking-wide text-bone/60 border-b border-bone/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Shop Now
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default CategoryTiles;
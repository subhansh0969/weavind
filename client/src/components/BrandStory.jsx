import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function BrandStory() {
  return (
    <section className="bg-indigo text-bone py-20 my-4">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-display uppercase tracking-[0.2em] text-xs text-gold mb-5"
        >
          Our Craft
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-body text-3xl md:text-4xl leading-tight mb-6"
        >
          Every thread carries a story — of hands that wove it, and dyes drawn from the earth of India.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-bone/70 leading-relaxed mb-8"
        >
          We work directly with weavers and small ateliers to bring you clothing that respects craft, pays fairly, and never compromises on quality.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <Link
            to="/about"
            className="font-display uppercase tracking-wide text-xs border-b border-gold text-gold pb-1 hover:text-bone hover:border-bone transition-colors"
          >
            Read Our Story
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default BrandStory;
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-6 py-24 text-center">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <p className="font-display uppercase tracking-[0.2em] text-xs text-madder mb-4">
          404
        </p>
        <h1 className="font-body text-4xl text-ink mb-4">Page not found</h1>
        <p className="text-ink/60 mb-8">
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <Link
          to="/"
          className="inline-block px-8 py-3 bg-ink text-bone font-display uppercase tracking-wide text-sm rounded-sm hover:bg-indigo transition-colors"
        >
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}

export default NotFound;
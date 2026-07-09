import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';

function Wishlist() {
  const { user } = useAuth();
  const { wishlist } = useWishlist();

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-6 py-24 text-center">
        <h2 className="font-body text-2xl text-ink mb-4">Please sign in</h2>
        <Link to="/login" className="text-indigo font-display underline">
          Go to Login
        </Link>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="max-w-md mx-auto px-6 py-24 text-center">
        <p className="font-display uppercase tracking-wide text-sm text-ink/50 mb-4">
          My Wishlist
        </p>
        <h2 className="font-body text-2xl text-ink mb-6">
          Your wishlist is empty.
        </h2>
        <Link
          to="/"
          className="inline-block px-8 py-3 bg-ink text-bone font-display uppercase tracking-wide text-sm rounded-sm hover:bg-indigo transition-colors"
        >
          Browse the Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display uppercase tracking-wide text-sm text-ink/50 mb-8"
      >
        My Wishlist ({wishlist.length})
      </motion.h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {wishlist.map((product, i) => (
          <ProductCard key={product._id} product={product} index={i} />
        ))}
      </div>
    </div>
  );
}

export default Wishlist;
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

function ProductCard({ product, index = 0 }) {
  // Safe destructuring: prevents crashes if providers are missing
  const { user = null } = useAuth() || {};
  const { 
    isWishlisted = () => false, 
    toggleWishlist = () => {} 
  } = useWishlist() || {};

  const hasDiscount = product.mrp && product.mrp > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  const hasSecondImage = product.images && product.images.length > 1;
  
  // Safely check if the product is wishlisted
  const wishlisted = user ? isWishlisted(product._id) : false;

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    toggleWishlist(product._id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
    >
      <Link 
        to={`/product/${product._id}`} 
        className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm p-2 -m-2 transition-colors"
      >
        <div className="relative aspect-[3/4] bg-ink/5 rounded-sm overflow-hidden mb-4">
          {product.images && product.images.length > 0 ? (
            <>
              <img
                src={product.images[0]}
                alt={product.name}
                className={
                  hasSecondImage
                    ? 'w-full h-full object-cover transition-opacity duration-700 ease-in-out group-hover:opacity-0'
                    : 'w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105'
                }
              />
              {hasSecondImage && (
                <img
                  src={product.images[1]}
                  alt={`${product.name} alternate view`}
                  className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700 ease-in-out group-hover:opacity-100"
                />
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-ink/30 font-display text-sm tracking-wide bg-bone/50">
              No Image
            </div>
          )}
          
          {/* Category Badge */}
          <div className="absolute top-3 left-3 bg-bone/95 backdrop-blur-sm px-2.5 py-1 text-[10px] uppercase tracking-widest font-display text-ink/80 rounded-sm shadow-sm">
            {product.category}
          </div>
          
          {/* Discount Badge */}
          {hasDiscount && (
            <div className="absolute top-3 right-3 bg-madder text-white px-2.5 py-1 text-[10px] uppercase tracking-widest font-display rounded-sm shadow-sm">
              {discountPercent}% OFF
            </div>
          )}
          
          {/* Wishlist Button */}
          {user && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleWishlistClick}
              className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-bone/95 backdrop-blur-sm shadow-sm flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-madder group/btn border border-transparent hover:border-ink/10 transition-colors"
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill={wishlisted ? '#A8412F' : 'none'}
                stroke={wishlisted ? '#A8412F' : '#161616'}
                strokeWidth="1.5"
                className="transition-colors duration-300 group-hover/btn:stroke-madder"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </motion.button>
          )}
        </div>
        
        {/* Product Meta */}
        <div className="space-y-1.5 px-1">
          {product.productType && (
            <p className="font-display text-[10px] uppercase tracking-widest text-ink/40">
              {product.productType}
            </p>
          )}
          
          <h3 className="font-body text-base sm:text-lg text-ink leading-snug group-hover:text-indigo transition-colors line-clamp-1">
            {product.name}
          </h3>
          
          <div className="flex items-center gap-2.5">
            <p className="font-display text-sm sm:text-base text-ink tracking-wide">₹{product.price}</p>
            {hasDiscount && (
              <p className="font-display text-xs sm:text-sm text-ink/40 line-through tracking-wide">₹{product.mrp}</p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default ProductCard;
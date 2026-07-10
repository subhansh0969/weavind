import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api/axios";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import ProductReviews from "../components/ProductReviews";
import ProductGallery from "../components/ProductGallery";
import Skeleton from "../components/Skeleton";

function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { isWishlisted, toggleWishlist } = useWishlist();
  
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [added, setAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false); // New state for elegant validation

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await API.get(`/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError("We couldn't find the product you're looking for.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    // Reset selections on product change
    setSelectedSize(null);
    setSizeError(false);
  }, [id]);

  if (loading)
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 mt-6 md:mt-8">
          <Skeleton className="aspect-[3/4] w-full rounded-sm" />
          <div className="pt-4">
            <Skeleton className="h-3 w-32 mb-4" />
            <Skeleton className="h-10 w-3/4 mb-5" />
            <Skeleton className="h-8 w-1/3 mb-8" />
            <Skeleton className="h-4 w-full mb-3" />
            <Skeleton className="h-4 w-2/3 mb-10" />
            <Skeleton className="h-3 w-16 mb-4" />
            <div className="flex gap-3 mb-8">
              <Skeleton className="w-11 h-11 rounded-full" />
              <Skeleton className="w-11 h-11 rounded-full" />
              <Skeleton className="w-11 h-11 rounded-full" />
            </div>
            <Skeleton className="h-14 w-full md:w-64 rounded-sm" />
          </div>
        </div>
      </div>
    );
    
  if (error)
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center px-4 text-center">
        <p className="font-body text-xl text-ink mb-4">{error}</p>
        <Link to="/" className="font-display text-xs uppercase tracking-widest text-indigo hover:text-ink underline underline-offset-4 transition-colors">
          Return to Collection
        </Link>
      </div>
    );

  const hasDiscount = product.mrp && product.mrp > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    addToCart(product, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <Link
          to="/"
          className="inline-flex items-center font-display text-[11px] uppercase tracking-widest text-ink/50 hover:text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm px-1 -mx-1"
        >
          <span className="mr-2">←</span> Back to Collection
        </Link>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-16 mt-8">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative"
          >
            <ProductGallery images={product.images} productName={product.name} />
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="flex flex-col pt-2"
          >
            <p className="font-display uppercase tracking-[0.2em] text-[10px] text-ink/50 mb-4">
              {product.category} {product.brand ? `· ${product.brand}` : ''}
            </p>
            
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="font-body text-3xl sm:text-4xl lg:text-5xl text-ink leading-[1.1]">
                {product.name}
              </h1>
              {user && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleWishlist(product._id)}
                  className="flex-shrink-0 w-11 h-11 rounded-full border border-ink/10 flex items-center justify-center mt-1 hover:border-ink/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-madder group"
                  aria-label={isWishlisted(product._id) ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill={isWishlisted(product._id) ? '#A8412F' : 'none'}
                    stroke={isWishlisted(product._id) ? '#A8412F' : '#161616'}
                    strokeWidth="1.5"
                    className="transition-colors group-hover:stroke-madder"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </motion.button>
              )}
            </div>

            <div className="flex items-baseline gap-3 sm:gap-4 mb-8">
              <p className="font-display text-2xl sm:text-3xl text-ink tracking-wide">₹{product.price}</p>
              {hasDiscount && (
                <>
                  <p className="font-display text-lg sm:text-xl text-ink/40 line-through tracking-wide">
                    ₹{product.mrp}
                  </p>
                  <p className="font-display text-xs uppercase tracking-widest text-madder font-600 border border-madder/20 px-2 py-1 rounded-sm bg-madder/5">
                    {discountPercent}% off
                  </p>
                </>
              )}
            </div>

            <p className="text-ink/70 leading-relaxed mb-10 text-sm sm:text-base font-body max-w-prose">
              {product.description}
            </p>

            {/* Sizes */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <p className="font-display text-[11px] uppercase tracking-widest text-ink/50">
                  Select Size
                </p>
                {/* Elegant Inline Error */}
                <AnimatePresence>
                  {sizeError && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="font-display text-[10px] uppercase tracking-widest text-madder flex items-center gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-madder block" />
                      Size is required
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              
              <div className="flex gap-2.5 flex-wrap">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      setSelectedSize(size);
                      setSizeError(false);
                    }}
                    className={`relative w-12 h-12 rounded-full font-display text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo ${
                      selectedSize === size
                        ? "bg-indigo text-white border-indigo"
                        : sizeError 
                          ? "border border-madder text-ink bg-madder/5 hover:bg-madder/10"
                          : "border border-ink/20 text-ink/80 hover:border-ink hover:text-ink"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="mb-8">
              <p className="font-display text-[11px] uppercase tracking-widest text-ink/50 mb-2">
                Available Colors
              </p>
              <p className="text-ink/80 text-sm font-display tracking-wide capitalize">
                {product.colors.join(" · ")}
              </p>
            </div>

            <div className="flex items-center justify-between mb-5">
              <p className="font-display text-[11px] uppercase tracking-widest text-ink/50">
                {product.stock > 0 ? (
                  <span className="text-indigo/80">In Stock ({product.stock})</span>
                ) : (
                  <span className="text-madder">Out of stock</span>
                )}
              </p>
            </div>

            {/* Add to Cart CTA */}
            <motion.button
              whileHover={{ scale: product.stock > 0 ? 1.01 : 1 }}
              whileTap={{ scale: product.stock > 0 ? 0.98 : 1 }}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`w-full md:w-80 px-8 py-4.5 font-display uppercase tracking-widest text-xs rounded-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold flex items-center justify-center gap-3 mb-12 ${
                added 
                  ? "bg-indigo text-white border border-indigo shadow-md"
                  : sizeError
                    ? "bg-ink text-bone border border-ink shadow-sm"
                    : "bg-ink text-bone border border-ink hover:bg-transparent hover:text-ink shadow-sm hover:shadow-none"
              } disabled:opacity-30 disabled:hover:bg-ink disabled:hover:text-bone disabled:cursor-not-allowed`}
            >
              {added ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Added to Cart
                </>
              ) : (
                "Add to Cart"
              )}
            </motion.button>

            {/* Trust Policies */}
            <div className="border-t border-ink/10 pt-8 space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-bone border border-ink/5 flex items-center justify-center flex-shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink/60">
                    <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                    <path d="M21 3v5h-5" />
                  </svg>
                </div>
                <div className="pt-1">
                  <p className="font-display text-sm tracking-wide text-ink">
                    {product.returnPolicyDays > 0
                      ? `${product.returnPolicyDays} Days Return & Exchange`
                      : 'Non-Returnable Item'}
                  </p>
                  <p className="font-body text-sm text-ink/60 mt-1 leading-relaxed">
                    {product.returnPolicyDays > 0
                      ? 'Not the right fit? Return it easily within the policy window.'
                      : 'Final sale. This item cannot be returned or exchanged.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-bone border border-ink/5 flex items-center justify-center flex-shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink/60">
                    <rect x="1" y="3" width="15" height="13" rx="2" />
                    <path d="M16 8h4l3 3v5h-7V8z" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                </div>
                <div className="pt-1">
                  <p className="font-display text-sm tracking-wide text-ink">Free Premium Shipping</p>
                  <p className="font-body text-sm text-ink/60 mt-1 leading-relaxed">
                    Carefully packaged and delivered in 4-7 business days across India.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <ProductReviews productId={id} />
    </div>
  );
}

export default ProductDetail;
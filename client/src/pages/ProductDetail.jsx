import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../api/axios";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import ProductReviews from "../components/ProductReviews";
import ProductGallery from "../components/ProductGallery";

function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [added, setAdded] = useState(false);
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await API.get(`/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError("Product not found");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading)
    return (
      <p className="font-display text-center py-20 text-ink/50">Loading...</p>
    );
  if (error)
    return (
      <p className="font-display text-center py-20 text-madder">{error}</p>
    );

  const hasDiscount = product.mrp && product.mrp > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  return (
    <div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <Link
          to="/"
          className="font-display text-xs uppercase tracking-wide text-ink/50 hover:text-indigo transition-colors"
        >
          ← Back to Collection
        </Link>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 mt-6 md:mt-8">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <ProductGallery images={product.images} productName={product.name} />
            {hasDiscount && (
              <div className="absolute top-4 right-4 bg-madder text-white px-3 py-1.5 text-xs uppercase tracking-wider font-display rounded-sm z-10">
                {discountPercent}% OFF
              </div>
            )}
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="font-display uppercase tracking-[0.2em] text-xs text-madder mb-3">
              {product.category} · {product.brand}
            </p>
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="font-body text-2xl sm:text-4xl text-ink leading-tight">
                {product.name}
              </h1>
              {user && (
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => toggleWishlist(product._id)}
                  className="flex-shrink-0 w-10 h-10 rounded-full border border-ink/15 flex items-center justify-center mt-1"
                  aria-label="Toggle wishlist"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill={isWishlisted(product._id) ? '#A8412F' : 'none'}
                    stroke={isWishlisted(product._id) ? '#A8412F' : '#161616'}
                    strokeWidth="2"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </motion.button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6">
              <p className="font-display text-xl sm:text-2xl text-ink">₹{product.price}</p>
              {hasDiscount && (
                <>
                  <p className="font-display text-base sm:text-lg text-ink/40 line-through">
                    ₹{product.mrp}
                  </p>
                  <p className="font-display text-sm text-madder font-semibold">
                    {discountPercent}% off
                  </p>
                </>
              )}
            </div>

            <p className="text-ink/70 leading-relaxed mb-8 text-sm sm:text-base">
              {product.description}
            </p>

            {/* Sizes */}
            <div className="mb-6">
              <p className="font-display text-xs uppercase tracking-wide text-ink/50 mb-3">
                Size
              </p>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full font-display text-sm border transition-all ${
                      selectedSize === size
                        ? "bg-indigo text-white border-indigo"
                        : "border-ink/20 text-ink/70 hover:border-indigo"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="mb-6">
              <p className="font-display text-xs uppercase tracking-wide text-ink/50 mb-3">
                Colors
              </p>
              <p className="text-ink/70 text-sm sm:text-base">{product.colors.join(" · ")}</p>
            </div>

            <p className="font-display text-xs text-ink/50 mb-6">
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </p>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (!selectedSize) {
                  alert("Please select a size");
                  return;
                }
                addToCart(product, selectedSize);
                setAdded(true);
                setTimeout(() => setAdded(false), 1500);
              }}
              disabled={product.stock === 0}
              className="w-full md:w-auto px-10 py-4 bg-ink text-bone font-display uppercase tracking-wide text-sm rounded-sm hover:bg-indigo transition-colors disabled:opacity-40 disabled:cursor-not-allowed mb-8"
            >
              {added ? "Added ✓" : "Add to Cart"}
            </motion.button>

            {/* Trust badges / Return Policy */}
            <div className="border-t border-ink/10 pt-6 space-y-4">
              <div className="flex items-start gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo mt-0.5 flex-shrink-0">
                  <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                </svg>
                <div>
                  <p className="font-display text-sm text-ink">
                    {product.returnPolicyDays > 0
                      ? `${product.returnPolicyDays} Days Return & Exchange`
                      : 'Non-Returnable Item'}
                  </p>
                  <p className="font-display text-xs text-ink/50 mt-0.5">
                    {product.returnPolicyDays > 0
                      ? 'Easy returns if you change your mind'
                      : 'This item cannot be returned or exchanged'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo mt-0.5 flex-shrink-0">
                  <rect x="1" y="3" width="15" height="13" rx="2" />
                  <path d="M16 8h4l3 3v5h-7V8z" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
                <div>
                  <p className="font-display text-sm text-ink">Free Shipping</p>
                  <p className="font-display text-xs text-ink/50 mt-0.5">
                    Delivered in 4-7 business days across India
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo mt-0.5 flex-shrink-0">
                  <rect x="3" y="11" width="18" height="10" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <div>
                  <p className="font-display text-sm text-ink">Secure Payments</p>
                  <p className="font-display text-xs text-ink/50 mt-0.5">
                    100% secure payment powered by Razorpay
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
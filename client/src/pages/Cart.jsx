import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-32 text-center flex flex-col items-center">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-ink/20 mb-6">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
        <p className="font-display uppercase tracking-widest text-xs text-ink/50 mb-4">
          Your Cart
        </p>
        <h2 className="font-body text-3xl sm:text-4xl text-ink mb-8">It's empty in here.</h2>
        <Link
          to="/"
          className="inline-block px-10 py-4 bg-ink text-bone font-display uppercase tracking-widest text-xs rounded-sm hover:bg-indigo transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          Browse the Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="flex items-end justify-between mb-8 sm:mb-10 border-b border-ink/10 pb-4">
        <h2 className="font-display uppercase tracking-wide text-sm text-ink/60">
          Your Cart
        </h2>
        <span className="font-display text-xs text-ink/40 tracking-wider">
          {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
        </span>
      </div>

      <div className="space-y-8">
        <AnimatePresence>
          {cartItems.map((item) => (
            <motion.div
              key={`${item._id}-${item.size}`}
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex gap-4 sm:gap-6 border-b border-ink/5 pb-8 group"
            >
              {/* Product Thumbnail */}
              <Link to={`/product/${item._id}`} className="w-24 h-32 sm:w-28 sm:h-36 bg-bone rounded-sm overflow-hidden flex items-center justify-center flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">
                {item.images && item.images.length > 0 ? (
                  <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <span className="text-ink/30 text-[10px] font-display uppercase tracking-wider">No Image</span>
                )}
              </Link>

              {/* Product Details */}
              <div className="flex-1 min-w-0 flex flex-col">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <Link to={`/product/${item._id}`} className="font-body text-lg sm:text-xl text-ink leading-snug hover:text-indigo transition-colors focus-visible:outline-none focus-visible:underline underline-offset-4 line-clamp-2">
                      {item.name}
                    </Link>
                    <p className="font-display text-xs uppercase tracking-wide text-ink/50 mt-2">
                      Size: <span className="text-ink/80">{item.size}</span>
                    </p>
                  </div>
                  <p className="font-display text-base sm:text-lg text-ink whitespace-nowrap text-right">
                    ₹{item.price * item.quantity}
                    {item.quantity > 1 && (
                      <span className="block text-[10px] text-ink/40 mt-1 uppercase tracking-wider">
                        (₹{item.price} each)
                      </span>
                    )}
                  </p>
                </div>

                <div className="mt-auto flex items-center justify-between flex-wrap gap-4 pt-4">
                  {/* Quantity Selector */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item._id, item.size, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      aria-label="Decrease quantity"
                      className="w-8 h-8 rounded-full border border-ink/20 flex items-center justify-center hover:border-indigo hover:text-indigo transition-colors flex-shrink-0 disabled:opacity-30 disabled:hover:border-ink/20 disabled:hover:text-ink disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo"
                    >
                      −
                    </button>
                    <span className="font-display text-sm w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
                      aria-label="Increase quantity"
                      className="w-8 h-8 rounded-full border border-ink/20 flex items-center justify-center hover:border-indigo hover:text-indigo transition-colors flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo"
                    >
                      +
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item._id, item.size)}
                    className="font-display text-[11px] uppercase tracking-widest text-ink/40 hover:text-madder transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-madder px-1 rounded-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Summary */}
      <div className="mt-12 bg-bone/40 p-6 sm:p-8 border border-ink/5 rounded-sm">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6 mb-8">
          <div>
            <p className="font-display text-[11px] uppercase tracking-widest text-ink/50 mb-1">Subtotal</p>
            <p className="font-body text-3xl sm:text-4xl text-ink">₹{cartTotal}</p>
            <p className="font-display text-xs text-ink/50 mt-2">
              Taxes and shipping calculated at checkout.
            </p>
          </div>
          <div className="flex items-center gap-2 text-ink/60 bg-white px-3 py-1.5 rounded-sm border border-ink/5 w-fit">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span className="font-display text-[10px] uppercase tracking-widest">Secure Checkout</span>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => navigate('/checkout')}
          className="w-full py-4.5 bg-ink text-bone font-display uppercase tracking-widest text-xs rounded-sm hover:bg-indigo transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold flex justify-center items-center gap-2 shadow-sm"
        >
          Proceed to Checkout
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </motion.button>
      </div>
    </div>
  );
}

export default Cart;
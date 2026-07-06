import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <p className="font-display uppercase tracking-wide text-sm text-ink/50 mb-4">
          Your Cart
        </p>
        <h2 className="font-body text-3xl text-ink mb-6">It's empty in here.</h2>
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <h2 className="font-display uppercase tracking-wide text-sm text-ink/50 mb-6 sm:mb-8">
        Your Cart ({cartItems.length})
      </h2>

      <div className="space-y-6">
        <AnimatePresence>
          {cartItems.map((item) => (
            <motion.div
              key={`${item._id}-${item.size}`}
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex gap-3 sm:gap-5 border-b border-ink/10 pb-6"
            >
              <div className="w-20 h-24 sm:w-24 sm:h-28 bg-ink/5 rounded-sm overflow-hidden flex items-center justify-center flex-shrink-0">
                {item.images && item.images.length > 0 ? (
                  <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-ink/30 text-xs">No Image</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-body text-base sm:text-lg text-ink leading-snug">
                    {item.name}
                  </h3>
                  <p className="font-display text-sm sm:text-base text-ink whitespace-nowrap">
                    ₹{item.price * item.quantity}
                  </p>
                </div>
                <p className="font-display text-xs text-ink/50 mt-1">Size: {item.size}</p>
                <p className="font-display text-madder text-sm mt-1">₹{item.price}</p>

                <div className="flex items-center gap-2 sm:gap-3 mt-3 flex-wrap">
                  <button
                    onClick={() => updateQuantity(item._id, item.size, item.quantity - 1)}
                    className="w-7 h-7 rounded-full border border-ink/20 flex items-center justify-center hover:border-indigo transition-colors flex-shrink-0"
                  >
                    −
                  </button>
                  <span className="font-display text-sm w-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
                    className="w-7 h-7 rounded-full border border-ink/20 flex items-center justify-center hover:border-indigo transition-colors flex-shrink-0"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item._id, item.size)}
                    className="font-display text-xs uppercase tracking-wide text-ink/40 hover:text-madder transition-colors sm:ml-4"
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
      <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-t border-ink/10 pt-6">
        <div>
          <p className="font-display text-xs uppercase tracking-wide text-ink/50">Total</p>
          <p className="font-body text-2xl text-ink">₹{cartTotal}</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/checkout')}
          className="w-full sm:w-auto px-10 py-4 bg-ink text-bone font-display uppercase tracking-wide text-sm rounded-sm hover:bg-indigo transition-colors"
        >
          Checkout
        </motion.button>
      </div>
    </div>
  );
}

export default Cart;
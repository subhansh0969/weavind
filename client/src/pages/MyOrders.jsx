import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Skeleton from '../components/Skeleton';

const STATUS_STEPS = ['Pending', 'Confirmed', 'Shipped', 'Delivered'];
const CANCELLABLE_STATUSES = ['Pending', 'Confirmed'];

// Refactored OrderTracker: Flawless Flexbox Alignment
function OrderTracker({ status }) {
  if (status === 'Cancelled') {
    return (
      <div className="flex items-center justify-center sm:justify-start gap-2 mt-6 p-4 bg-madder/5 border border-madder/10 rounded-sm">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-madder">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
        <span className="font-display text-xs text-madder uppercase tracking-widest font-600">
          Order Cancelled
        </span>
      </div>
    );
  }

  const currentIndex = STATUS_STEPS.indexOf(status);

  return (
    <div className="relative mt-8 mb-4 px-2 sm:px-4">
      {/* Background Track Line */}
      <div className="absolute top-2 left-8 right-8 h-0.5 bg-ink/10 -z-10" />
      
      <div className="flex justify-between items-start w-full relative z-10">
        {STATUS_STEPS.map((step, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;
          
          return (
            <div key={step} className="flex flex-col items-center relative w-16">
              {/* Active Line Fill (Only draws up to the current step) */}
              {index > 0 && isCompleted && (
                <div className="absolute top-2 right-1/2 w-full h-0.5 bg-indigo -z-10" />
              )}
              
              <div
                className={`w-4 h-4 rounded-full border-2 bg-bone flex items-center justify-center transition-colors duration-500 ${
                  isCompleted ? 'border-indigo' : 'border-ink/20'
                }`}
              >
                {isCompleted && (
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo" />
                )}
              </div>
              <span
                className={`font-display text-[10px] uppercase tracking-wider mt-3 text-center transition-colors duration-500 ${
                  isCurrent ? 'text-indigo font-600' : isCompleted ? 'text-ink/80' : 'text-ink/30'
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [confirmCancelId, setConfirmCancelId] = useState(null); // New state for elegant UI confirmation

  const fetchOrders = () => {
    API.get('/orders/myorders')
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleConfirmCancel = async (orderId) => {
    setCancellingId(orderId);
    try {
      await API.put(`/orders/${orderId}/cancel`);
      fetchOrders();
      setConfirmCancelId(null);
    } catch (err) {
      // In a real app, integrate the local notification state here like AdminDashboard
      console.error(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancellingId(null);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-6 py-24 text-center">
        <h2 className="font-body text-3xl text-ink mb-4">Please sign in</h2>
        <Link to="/login" className="inline-block px-8 py-3 bg-ink text-bone font-display uppercase tracking-widest text-xs rounded-sm hover:bg-indigo transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold mt-4">
          Go to Login
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <Skeleton className="h-6 w-40 mb-10" />
        <div className="space-y-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border border-ink/10 rounded-sm p-6 sm:p-8">
              <div className="flex justify-between mb-6">
                <div>
                  <Skeleton className="h-3 w-32 mb-3" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
              <Skeleton className="h-2 w-full mb-8 mt-6" />
              <div className="border-t border-ink/10 pt-4 flex justify-between">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-32 text-center flex flex-col items-center">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-ink/20 mb-6">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
        <p className="font-display uppercase tracking-widest text-xs text-ink/50 mb-4">
          Order History
        </p>
        <h2 className="font-body text-3xl sm:text-4xl text-ink mb-8">
          You haven't placed any orders yet.
        </h2>
        <Link
          to="/"
          className="inline-block px-10 py-4 bg-ink text-bone font-display uppercase tracking-widest text-xs rounded-sm hover:bg-indigo transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="flex items-end justify-between mb-8 sm:mb-12 border-b border-ink/10 pb-4">
        <h2 className="font-display uppercase tracking-wide text-sm text-ink/60">
          My Orders
        </h2>
        <span className="font-display text-xs text-ink/40 tracking-wider">
          {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
        </span>
      </div>

      <div className="space-y-8">
        {orders.map((order, index) => (
          <motion.div
            key={order._id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, ease: "easeOut" }}
            className="border border-ink/15 rounded-sm p-5 sm:p-8 bg-bone/30 shadow-sm"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 border-b border-ink/5 pb-5">
              <div>
                <p className="font-display text-[11px] text-ink/50 uppercase tracking-widest mb-1">
                  Order <span className="text-ink font-600">#{order._id.slice(-8).toUpperCase()}</span>
                </p>
                <p className="font-display text-xs text-ink/60 mb-1">
                  Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric',
                  })}
                </p>
                <p className="font-display text-[10px] text-indigo uppercase tracking-wider bg-indigo/5 inline-block px-2 py-0.5 rounded-sm border border-indigo/10">
                  {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Paid Online'}
                </p>
              </div>
              <div className="sm:text-right flex flex-row sm:flex-col justify-between items-end sm:items-end">
                <p className="font-body text-xl sm:text-2xl text-ink">₹{order.totalAmount}</p>
                <p className="font-display text-[10px] uppercase tracking-widest text-ink/50 mt-1">
                  Total Amount
                </p>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-4 mb-6">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-12 h-16 bg-bone border border-ink/5 flex-shrink-0 rounded-sm overflow-hidden">
                     {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                     ) : (
                        <div className="w-full h-full flex items-center justify-center text-[8px] text-ink/30 uppercase font-display">Img</div>
                     )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm sm:text-base text-ink line-clamp-1">{item.name}</p>
                    <p className="font-display text-[10px] text-ink/50 uppercase tracking-wider mt-0.5">
                      Size: {item.size} <span className="mx-1">·</span> Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="font-display text-sm text-ink/80 whitespace-nowrap">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <OrderTracker status={order.status} />

            {/* Footer & Actions */}
            <div className="mt-8 pt-5 border-t border-ink/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="font-display text-[11px] uppercase tracking-widest text-ink/50 mb-1">
                  Shipping To
                </p>
                <p className="font-display text-sm text-ink/80">
                  {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}
                </p>
              </div>

              {CANCELLABLE_STATUSES.includes(order.status) && (
                <div className="flex items-center sm:justify-end">
                  <AnimatePresence mode="wait">
                    {confirmCancelId === order._id ? (
                      <motion.div
                        key="confirm"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="flex items-center gap-2 bg-madder/5 p-1.5 rounded-sm border border-madder/10"
                      >
                        <span className="font-display text-[10px] uppercase tracking-widest text-madder/80 px-2">Cancel?</span>
                        <button
                          onClick={() => setConfirmCancelId(null)}
                          className="font-display text-xs uppercase tracking-wide text-ink/60 hover:text-ink px-3 py-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink rounded-sm transition-colors"
                        >
                          Keep
                        </button>
                        <button
                          onClick={() => handleConfirmCancel(order._id)}
                          disabled={cancellingId === order._id}
                          className="font-display text-xs uppercase tracking-wide bg-madder text-white px-4 py-1.5 rounded-sm hover:bg-madder/90 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-madder transition-colors"
                        >
                          {cancellingId === order._id ? 'Cancelling...' : 'Yes, Cancel'}
                        </button>
                      </motion.div>
                    ) : (
                      <motion.button
                        key="initiate"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setConfirmCancelId(order._id)}
                        className="font-display text-[11px] uppercase tracking-widest text-ink/50 hover:text-madder transition-colors px-2 py-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-madder rounded-sm"
                      >
                        Cancel Order
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default MyOrders;
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const STATUS_STEPS = ['Pending', 'Confirmed', 'Shipped', 'Delivered'];
const CANCELLABLE_STATUSES = ['Pending', 'Confirmed'];

function OrderTracker({ status }) {
  if (status === 'Cancelled') {
    return (
      <div className="flex items-center gap-2 mt-3">
        <span className="w-2.5 h-2.5 rounded-full bg-madder" />
        <span className="font-display text-xs text-madder uppercase tracking-wide">
          Order Cancelled
        </span>
      </div>
    );
  }

  const currentIndex = STATUS_STEPS.indexOf(status);

  return (
    <div className="flex items-center mt-4">
      {STATUS_STEPS.map((step, index) => (
        <div key={step} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center">
            <div
              className={
                index <= currentIndex
                  ? 'w-3 h-3 rounded-full bg-indigo'
                  : 'w-3 h-3 rounded-full bg-ink/15'
              }
            />
            <span
              className={
                index <= currentIndex
                  ? 'font-display text-[10px] uppercase tracking-wide text-indigo mt-1.5 whitespace-nowrap'
                  : 'font-display text-[10px] uppercase tracking-wide text-ink/30 mt-1.5 whitespace-nowrap'
              }
            >
              {step}
            </span>
          </div>
          {index < STATUS_STEPS.length - 1 && (
            <div
              className={
                index < currentIndex
                  ? 'h-0.5 flex-1 bg-indigo mx-1 -mt-4'
                  : 'h-0.5 flex-1 bg-ink/15 mx-1 -mt-4'
              }
            />
          )}
        </div>
      ))}
    </div>
  );
}

function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchOrders = () => {
    API.get('/orders/myorders')
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancel = async (orderId) => {
    const confirmed = window.confirm('Are you sure you want to cancel this order?');
    if (!confirmed) return;

    setCancellingId(orderId);
    try {
      await API.put('/orders/' + orderId + '/cancel');
      fetchOrders();
    } catch (err) {
      window.alert(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancellingId(null);
    }
  };

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

  if (loading) {
    return (
      <p className="font-display text-center py-20 text-ink/50">
        Loading your orders...
      </p>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-md mx-auto px-6 py-24 text-center">
        <p className="font-display uppercase tracking-wide text-sm text-ink/50 mb-4">
          My Orders
        </p>
        <h2 className="font-body text-2xl text-ink mb-6">
          You haven't placed any orders yet.
        </h2>
        <Link
          to="/"
          className="inline-block px-8 py-3 bg-ink text-bone font-display uppercase tracking-wide text-sm rounded-sm hover:bg-indigo transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <h2 className="font-display uppercase tracking-wide text-sm text-ink/50 mb-8">
        My Orders ({orders.length})
      </h2>

      <div className="space-y-6">
        {orders.map((order, index) => (
          <motion.div
            key={order._id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="border border-ink/10 rounded-sm p-4 sm:p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <p className="font-display text-xs text-ink/40 uppercase tracking-wide">
                  Order #{order._id.slice(-8).toUpperCase()}
                </p>
                <p className="font-display text-xs text-ink/40 mt-0.5">
                  Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
                <p className="font-display text-xs text-ink/40 mt-0.5">
                  Payment: {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online'}
                </p>
              </div>
              <div className="text-right">
                <p className="font-body text-lg text-ink">₹{order.totalAmount}</p>
                <p className="font-display text-xs text-ink/40">
                  {order.paymentStatus === 'Paid' ? 'Payment Confirmed' : 'Payment ' + order.paymentStatus}
                </p>
              </div>
            </div>

            <div className="space-y-2 mb-2">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm gap-3">
                  <span className="text-ink/70">
                    {item.name} ({item.size}) × {item.quantity}
                  </span>
                  <span className="font-display text-ink/70 whitespace-nowrap">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <OrderTracker status={order.status} />

            <div className="mt-5 pt-4 border-t border-ink/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="font-display text-xs text-ink/50">
                  Delivering to: {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}
                </p>
                {order.status === 'Delivered' && (
                  <p className="font-display text-xs text-indigo mt-1">
                    Return window: 30 days from delivery
                  </p>
                )}
              </div>

              {CANCELLABLE_STATUSES.includes(order.status) && (
                <button
                  onClick={() => handleCancel(order._id)}
                  disabled={cancellingId === order._id}
                  className="font-display text-xs uppercase tracking-wide text-madder hover:underline disabled:opacity-50 text-left sm:text-right"
                >
                  {cancellingId === order._id ? 'Cancelling...' : 'Cancel Order'}
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default MyOrders;
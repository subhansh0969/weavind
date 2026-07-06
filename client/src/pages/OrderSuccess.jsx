import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../api/axios';

function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    API.get(`/orders/${id}`).then((res) => setOrder(res.data)).catch(() => {});
  }, [id]);

  return (
    <div className="max-w-lg mx-auto px-6 py-24 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="w-16 h-16 rounded-full bg-indigo mx-auto flex items-center justify-center mb-6">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p className="font-display uppercase tracking-[0.2em] text-xs text-madder mb-3">
          Order Confirmed
        </p>
        <h1 className="font-body text-3xl text-ink mb-4">Thank you{order ? `, ${order.shippingAddress.fullName}` : ''}!</h1>
        <p className="text-ink/70 mb-8">
          Your order has been placed and will be shipped soon. We'll notify you once it's on its way.
        </p>
        {order && (
          <p className="font-display text-xs text-ink/40 mb-8">
            Order ID: {order._id}
          </p>
        )}
        <Link
          to="/"
          className="inline-block px-8 py-3 bg-ink text-bone font-display uppercase tracking-wide text-sm rounded-sm hover:bg-indigo transition-colors"
        >
          Continue Shopping
        </Link>
      </motion.div>
    </div>
  );
}

export default OrderSuccess;
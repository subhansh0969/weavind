import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../api/axios';

function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/orders/${id}`)
      .then((res) => setOrder(res.data))
      .catch(() => {
        // Handle silently, UI will adapt
      })
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-20 sm:py-32 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="w-20 h-20 rounded-full bg-bone border border-ink/10 mx-auto flex items-center justify-center mb-8 relative">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-12 h-12 rounded-full bg-indigo flex items-center justify-center shadow-md"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </motion.div>
        </div>
        
        <p className="font-display uppercase tracking-[0.2em] text-[10px] text-madder mb-4">
          Order Confirmed
        </p>

        {/* Prevent layout shift while fetching order data */}
        <div className="min-h-[48px] mb-4">
          {loading ? (
            <div className="h-10 w-64 bg-ink/5 rounded-sm animate-pulse mx-auto" />
          ) : (
            <h1 className="font-body text-4xl sm:text-5xl text-ink leading-tight">
              Thank you{order ? `, ${order.shippingAddress.fullName.split(' ')[0]}` : ''}!
            </h1>
          )}
        </div>

        <p className="text-ink/70 mb-10 font-body text-sm sm:text-base leading-relaxed max-w-sm mx-auto">
          We've received your order and are getting it ready to be shipped. We will notify you once it's on its way.
        </p>

        {/* Digital Receipt Box */}
        <div className="bg-bone/40 border border-ink/5 rounded-sm p-6 mb-10 max-w-sm mx-auto">
          <p className="font-display text-[10px] uppercase tracking-widest text-ink/50 mb-1">
            Order Reference
          </p>
          <p className="font-display text-sm tracking-wide text-ink font-600">
            #{id.toUpperCase().slice(-8)}
          </p>
          
          <div className="border-t border-ink/5 my-4" />
          
          <div className="flex justify-between items-center text-sm font-display">
            <span className="text-ink/60">Status</span>
            <span className="text-indigo bg-indigo/10 px-2 py-1 rounded-sm text-[10px] uppercase tracking-widest font-600">
              Processing
            </span>
          </div>
        </div>

        <Link
          to="/"
          className="inline-flex items-center justify-center px-10 py-4.5 bg-ink text-bone font-display uppercase tracking-widest text-xs rounded-sm hover:bg-indigo transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold shadow-sm"
        >
          Continue Shopping
        </Link>
      </motion.div>
    </div>
  );
}

export default OrderSuccess;
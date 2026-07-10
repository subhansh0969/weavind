import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: user?.name || '',
    phone: '',
    addressLine: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('Online');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-6 py-32 text-center flex flex-col items-center">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-ink/20 mb-6">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <h2 className="font-body text-3xl text-ink mb-4">Please sign in to checkout</h2>
        <p className="font-body text-sm text-ink/60 mb-8">You need an account to track your orders and save shipping details.</p>
        <Link to="/login" className="inline-block px-10 py-4 bg-ink text-bone font-display uppercase tracking-widest text-xs rounded-sm hover:bg-indigo transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">
          Go to Login
        </Link>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto px-6 py-32 text-center">
        <h2 className="font-body text-3xl text-ink mb-4">Your cart is empty</h2>
        <Link to="/" className="text-indigo font-display text-sm tracking-wide underline underline-offset-4 hover:text-ink transition-colors">
          Browse the Collection
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const orderItems = cartItems.map((item) => ({
        product: item._id,
        name: item.name,
        price: item.price,
        size: item.size,
        quantity: item.quantity,
        image: item.images?.[0] || '',
      }));

      const orderResponse = await API.post('/orders', {
        items: orderItems,
        shippingAddress: form,
        totalAmount: cartTotal,
        paymentMethod,
      });

      const createdOrder = orderResponse.data;

      // COD logic
      if (paymentMethod === 'COD') {
        clearCart();
        navigate(`/order-success/${createdOrder._id}`);
        return;
      }

      // Razorpay online flow
      const razorpayOrderResponse = await API.post('/payment/create-order', {
        amount: cartTotal,
      });

      const razorpayOrder = razorpayOrderResponse.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'Weavind',
        description: 'Order Payment',
        order_id: razorpayOrder.id,
        handler: async function (response) {
          try {
            await API.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: createdOrder._id,
            });

            clearCart();
            navigate(`/order-success/${createdOrder._id}`);
          } catch (err) {
            setError('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: form.fullName,
          contact: form.phone,
          email: user.email,
        },
        theme: {
          color: '#1B2A4A', // Indigo
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
      <Link
        to="/cart"
        className="inline-flex items-center font-display text-[11px] uppercase tracking-widest text-ink/50 hover:text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm px-1 -mx-1 mb-8"
      >
        <span className="mr-2">←</span> Return to Cart
      </Link>

      <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* Left Column: Shipping Form */}
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-7">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-ink/10">
            <h2 className="font-body text-2xl sm:text-3xl text-ink">Shipping Details</h2>
            <p className="font-display text-[10px] uppercase tracking-widest text-ink/50 hidden sm:block">Step 1 of 2</p>
          </div>

          <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="fullName" className="font-display text-[11px] uppercase tracking-widest text-ink/70 ml-1">Full Name</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={form.fullName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3.5 border border-ink/15 rounded-sm focus:outline-none focus:border-indigo focus:ring-1 focus:ring-indigo bg-bone/30 font-display text-sm text-ink transition-all"
              />
            </div>
            
            <div className="space-y-1.5">
              <label htmlFor="phone" className="font-display text-[11px] uppercase tracking-widest text-ink/70 ml-1">Phone Number</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3.5 border border-ink/15 rounded-sm focus:outline-none focus:border-indigo focus:ring-1 focus:ring-indigo bg-bone/30 font-display text-sm text-ink transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="addressLine" className="font-display text-[11px] uppercase tracking-widest text-ink/70 ml-1">Address Line</label>
              <input
                id="addressLine"
                name="addressLine"
                type="text"
                value={form.addressLine}
                onChange={handleChange}
                required
                className="w-full px-4 py-3.5 border border-ink/15 rounded-sm focus:outline-none focus:border-indigo focus:ring-1 focus:ring-indigo bg-bone/30 font-display text-sm text-ink transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label htmlFor="city" className="font-display text-[11px] uppercase tracking-widest text-ink/70 ml-1">City</label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={form.city}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3.5 border border-ink/15 rounded-sm focus:outline-none focus:border-indigo focus:ring-1 focus:ring-indigo bg-bone/30 font-display text-sm text-ink transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="state" className="font-display text-[11px] uppercase tracking-widest text-ink/70 ml-1">State</label>
                <input
                  id="state"
                  name="state"
                  type="text"
                  value={form.state}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3.5 border border-ink/15 rounded-sm focus:outline-none focus:border-indigo focus:ring-1 focus:ring-indigo bg-bone/30 font-display text-sm text-ink transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="pincode" className="font-display text-[11px] uppercase tracking-widest text-ink/70 ml-1">Pincode</label>
              <input
                id="pincode"
                name="pincode"
                type="text"
                value={form.pincode}
                onChange={handleChange}
                required
                className="w-full sm:w-1/2 px-4 py-3.5 border border-ink/15 rounded-sm focus:outline-none focus:border-indigo focus:ring-1 focus:ring-indigo bg-bone/30 font-display text-sm text-ink transition-all"
              />
            </div>

            {/* Payment Method */}
            <div className="pt-8 mt-8 border-t border-ink/10">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-body text-xl sm:text-2xl text-ink">Payment Method</h3>
                <p className="font-display text-[10px] uppercase tracking-widest text-ink/50 hidden sm:block">Step 2 of 2</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Online')}
                  className={`flex flex-col items-start p-4 rounded-sm border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo ${
                    paymentMethod === 'Online'
                      ? 'border-indigo bg-indigo/5 shadow-sm'
                      : 'border-ink/15 bg-bone/30 hover:border-indigo/40'
                  }`}
                >
                  <div className="flex items-center gap-3 w-full mb-1">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={paymentMethod === 'Online' ? 'text-indigo' : 'text-ink/50'}>
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                      <line x1="1" y1="10" x2="23" y2="10" />
                    </svg>
                    <span className={`font-display text-sm tracking-wide ${paymentMethod === 'Online' ? 'text-indigo font-600' : 'text-ink/70'}`}>
                      Pay Online
                    </span>
                    {paymentMethod === 'Online' && (
                      <div className="w-4 h-4 rounded-full bg-indigo flex items-center justify-center ml-auto">
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      </div>
                    )}
                  </div>
                  <span className="font-display text-[10px] text-ink/50 pl-7 uppercase tracking-wider">UPI, Cards, Netbanking</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setPaymentMethod('COD')}
                  className={`flex flex-col items-start p-4 rounded-sm border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo ${
                    paymentMethod === 'COD'
                      ? 'border-indigo bg-indigo/5 shadow-sm'
                      : 'border-ink/15 bg-bone/30 hover:border-indigo/40'
                  }`}
                >
                  <div className="flex items-center gap-3 w-full mb-1">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={paymentMethod === 'COD' ? 'text-indigo' : 'text-ink/50'}>
                      <rect x="2" y="5" width="20" height="14" rx="2" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    <span className={`font-display text-sm tracking-wide ${paymentMethod === 'COD' ? 'text-indigo font-600' : 'text-ink/70'}`}>
                      Cash on Delivery
                    </span>
                    {paymentMethod === 'COD' && (
                      <div className="w-4 h-4 rounded-full bg-indigo flex items-center justify-center ml-auto">
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      </div>
                    )}
                  </div>
                  <span className="font-display text-[10px] text-ink/50 pl-7 uppercase tracking-wider">Pay at your doorstep</span>
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-madder/5 border border-madder/20 p-4 rounded-sm flex items-start gap-3 mt-6">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-madder mt-0.5 flex-shrink-0">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p className="text-madder text-sm font-display">{error}</p>
              </div>
            )}
          </form>
        </motion.div>

        {/* Right Column: Order Summary (Sticky) */}
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-5">
          <div className="sticky top-24 bg-bone/40 border border-ink/10 rounded-sm p-6 sm:p-8">
            <h3 className="font-body text-xl sm:text-2xl text-ink mb-6 border-b border-ink/10 pb-4">Order Summary</h3>
            
            {/* Visual Cart Items */}
            <div className="space-y-5 max-h-[40vh] overflow-y-auto pr-2 mb-6 custom-scrollbar">
              {cartItems.map((item) => (
                <div key={`${item._id}-${item.size}`} className="flex items-center gap-4">
                  <div className="w-16 h-20 bg-bone/80 border border-ink/5 rounded-sm overflow-hidden flex-shrink-0 relative">
                    {item.images && item.images.length > 0 ? (
                      <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[8px] text-ink/30 uppercase font-display">No Img</div>
                    )}
                    <span className="absolute -top-2 -right-2 bg-ink text-bone text-[10px] font-display w-5 h-5 rounded-full flex items-center justify-center border border-bone">
                      {item.quantity}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-body text-sm sm:text-base text-ink line-clamp-1">{item.name}</h4>
                    <p className="font-display text-[10px] uppercase tracking-wider text-ink/50 mt-0.5">Size: {item.size}</p>
                  </div>
                  <div className="font-display text-sm text-ink text-right">
                    ₹{item.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-ink/10 pt-5 space-y-3">
              <div className="flex justify-between font-display text-sm text-ink/70">
                <span>Subtotal</span>
                <span>₹{cartTotal}</span>
              </div>
              <div className="flex justify-between font-display text-sm text-ink/70">
                <span>Shipping</span>
                <span className="text-indigo uppercase tracking-wider text-xs">Free</span>
              </div>
              <div className="flex justify-between border-t border-ink/10 pt-4 mt-4">
                <span className="font-display uppercase tracking-widest text-xs text-ink/70 mt-1">Total</span>
                <span className="font-body text-2xl text-ink">₹{cartTotal}</span>
              </div>
            </div>

            {/* Submit Button Trigger (Connected to form via 'form' attribute) */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              form="checkout-form"
              disabled={loading}
              className="w-full mt-8 py-4.5 bg-ink text-bone font-display uppercase tracking-widest text-xs rounded-sm hover:bg-indigo transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold flex items-center justify-center gap-2 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                'Processing Securely...'
              ) : paymentMethod === 'COD' ? (
                `Place Order · ₹${cartTotal}`
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  Pay ₹{cartTotal}
                </>
              )}
            </motion.button>
            
            <p className="text-center font-display text-[10px] uppercase tracking-widest text-ink/40 mt-4 flex items-center justify-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Encrypted & Secure
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Checkout;
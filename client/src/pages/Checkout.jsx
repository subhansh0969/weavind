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
      <div className="max-w-md mx-auto px-6 py-24 text-center">
        <h2 className="font-body text-2xl text-ink mb-4">Please sign in to checkout</h2>
        <Link to="/login" className="text-indigo font-display underline">
          Go to Login
        </Link>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto px-6 py-24 text-center">
        <h2 className="font-body text-2xl text-ink mb-4">Your cart is empty</h2>
        <Link to="/" className="text-indigo font-display underline">
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

      // COD: order is already confirmed by the backend, skip straight to success
      if (paymentMethod === 'COD') {
        clearCart();
        navigate(`/order-success/${createdOrder._id}`);
        return;
      }

      // Online: proceed with Razorpay flow
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
          color: '#1B2A4A',
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
      setError(err.response?.data?.message || 'Failed to place order');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <h2 className="font-display uppercase tracking-wide text-sm text-ink/50 mb-6 sm:mb-8">
        Checkout
      </h2>

      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        {/* Shipping Form */}
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
          <h3 className="font-body text-lg sm:text-xl text-ink mb-5">Shipping Details</h3>
          <form onSubmit={handlePlaceOrder} className="space-y-4">
            <input
              name="fullName"
              placeholder="Full Name"
              value={form.fullName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-ink/20 rounded-sm focus:outline-none focus:border-indigo bg-transparent"
            />
            <input
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-ink/20 rounded-sm focus:outline-none focus:border-indigo bg-transparent"
            />
            <input
              name="addressLine"
              placeholder="Address"
              value={form.addressLine}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-ink/20 rounded-sm focus:outline-none focus:border-indigo bg-transparent"
            />
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                name="city"
                placeholder="City"
                value={form.city}
                onChange={handleChange}
                required
                className="w-full sm:w-1/2 px-4 py-3 border border-ink/20 rounded-sm focus:outline-none focus:border-indigo bg-transparent"
              />
              <input
                name="state"
                placeholder="State"
                value={form.state}
                onChange={handleChange}
                required
                className="w-full sm:w-1/2 px-4 py-3 border border-ink/20 rounded-sm focus:outline-none focus:border-indigo bg-transparent"
              />
            </div>
            <input
              name="pincode"
              placeholder="Pincode"
              value={form.pincode}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-ink/20 rounded-sm focus:outline-none focus:border-indigo bg-transparent"
            />

            {/* Payment Method */}
            <div>
              <p className="font-display text-xs uppercase tracking-wide text-ink/50 mb-3 mt-2">
                Payment Method
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Online')}
                  className={
                    paymentMethod === 'Online'
                      ? 'py-3 rounded-sm font-display text-sm border-2 border-indigo bg-indigo/10 text-indigo'
                      : 'py-3 rounded-sm font-display text-sm border border-ink/20 text-ink/60 hover:border-indigo/50'
                  }
                >
                  Pay Online
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('COD')}
                  className={
                    paymentMethod === 'COD'
                      ? 'py-3 rounded-sm font-display text-sm border-2 border-indigo bg-indigo/10 text-indigo'
                      : 'py-3 rounded-sm font-display text-sm border border-ink/20 text-ink/60 hover:border-indigo/50'
                  }
                >
                  Cash on Delivery
                </button>
              </div>
              {paymentMethod === 'COD' && (
                <p className="font-display text-xs text-ink/40 mt-2">
                  Pay ₹{cartTotal} in cash when your order is delivered.
                </p>
              )}
            </div>

            {error && <p className="text-madder text-sm font-display">{error}</p>}

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-ink text-bone font-display uppercase tracking-wide text-sm rounded-sm hover:bg-indigo transition-colors disabled:opacity-50"
            >
              {loading
                ? 'Processing...'
                : paymentMethod === 'COD'
                ? `Place Order · ₹${cartTotal}`
                : `Pay ₹${cartTotal}`}
            </motion.button>
          </form>
        </motion.div>

        {/* Order Summary */}
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}>
          <h3 className="font-body text-lg sm:text-xl text-ink mb-5">Order Summary</h3>
          <div className="space-y-3 sm:space-y-4">
            {cartItems.map((item) => (
              <div key={`${item._id}-${item.size}`} className="flex justify-between text-sm gap-3">
                <span className="text-ink/70">
                  {item.name} ({item.size}) × {item.quantity}
                </span>
                <span className="font-display text-ink whitespace-nowrap">
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-ink/10 mt-6 pt-4 flex justify-between">
            <span className="font-display uppercase text-xs text-ink/50">Total</span>
            <span className="font-body text-xl text-ink">₹{cartTotal}</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Checkout;
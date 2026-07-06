import { motion } from 'framer-motion';

function ShippingPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <p className="font-display uppercase tracking-[0.2em] text-xs text-madder mb-3">
          Policy
        </p>
        <h1 className="font-body text-4xl text-ink mb-8">Shipping Policy</h1>

        <div className="space-y-6 text-ink/70 leading-relaxed">
          <div>
            <h3 className="font-display text-ink text-lg mb-2">Delivery Timeline</h3>
            <p>Orders are processed within 1-2 business days and typically delivered within 4-7 business days across India, depending on your location.</p>
          </div>
          <div>
            <h3 className="font-display text-ink text-lg mb-2">Shipping Charges</h3>
            <p>We offer free shipping on all orders across India.</p>
          </div>
          <div>
            <h3 className="font-display text-ink text-lg mb-2">Order Tracking</h3>
            <p>Once your order ships, you can track its status anytime from the "My Orders" section of your account.</p>
          </div>
          <div>
            <h3 className="font-display text-ink text-lg mb-2">Delays</h3>
            <p>While we aim to meet our estimated delivery windows, occasional delays may occur due to courier logistics, weather, or regional restrictions beyond our control.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default ShippingPolicy;
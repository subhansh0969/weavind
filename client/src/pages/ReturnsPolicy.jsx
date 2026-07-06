import { motion } from 'framer-motion';

function ReturnsPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <p className="font-display uppercase tracking-[0.2em] text-xs text-madder mb-3">
          Policy
        </p>
        <h1 className="font-body text-4xl text-ink mb-8">Returns & Exchanges</h1>

        <div className="space-y-6 text-ink/70 leading-relaxed">
          <div>
            <h3 className="font-display text-ink text-lg mb-2">Return Window</h3>
            <p>Most items are eligible for return or exchange within 7 days of delivery. The exact return window for each product is listed on its product page.</p>
          </div>
          <div>
            <h3 className="font-display text-ink text-lg mb-2">Condition for Returns</h3>
            <p>Items must be unused, unwashed, and returned with original tags and packaging intact.</p>
          </div>
          <div>
            <h3 className="font-display text-ink text-lg mb-2">How to Initiate a Return</h3>
            <p>Go to "My Orders," select the relevant order, and contact our support team via the Contact Us page to begin the return process.</p>
          </div>
          <div>
            <h3 className="font-display text-ink text-lg mb-2">Refunds</h3>
            <p>Once we receive and inspect your returned item, refunds are processed within 5-7 business days to your original payment method.</p>
          </div>
          <div>
            <h3 className="font-display text-ink text-lg mb-2">Non-Returnable Items</h3>
            <p>Certain items may be marked non-returnable on their product page due to hygiene or other considerations.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default ReturnsPolicy;
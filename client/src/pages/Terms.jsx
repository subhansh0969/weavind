import { motion } from 'framer-motion';

function Terms() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <p className="font-display uppercase tracking-[0.2em] text-xs text-madder mb-3">
          Legal
        </p>
        <h1 className="font-body text-4xl text-ink mb-8">Terms of Service</h1>

        <div className="space-y-6 text-ink/70 leading-relaxed">
          <p>Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <div>
            <h3 className="font-display text-ink text-lg mb-2">Use of Site</h3>
            <p>By using Weavind, you agree to use this site for lawful purposes only and in a way that does not infringe on the rights of others.</p>
          </div>
          <div>
            <h3 className="font-display text-ink text-lg mb-2">Product Information</h3>
            <p>We strive to display accurate product details, pricing, and availability, but errors may occasionally occur. We reserve the right to correct any such errors.</p>
          </div>
          <div>
            <h3 className="font-display text-ink text-lg mb-2">Orders & Payments</h3>
            <p>All orders are subject to acceptance and availability. Payments are securely processed via Razorpay.</p>
          </div>
          <div>
            <h3 className="font-display text-ink text-lg mb-2">Limitation of Liability</h3>
            <p>Weavind is not liable for indirect or consequential damages arising from the use of our products or website.</p>
          </div>
          <div>
            <h3 className="font-display text-ink text-lg mb-2">Changes to Terms</h3>
            <p>We may update these terms from time to time. Continued use of the site constitutes acceptance of the revised terms.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Terms;
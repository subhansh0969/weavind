import { motion } from 'framer-motion';

function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <p className="font-display uppercase tracking-[0.2em] text-xs text-madder mb-3">
          Legal
        </p>
        <h1 className="font-body text-4xl text-ink mb-8">Privacy Policy</h1>

        <div className="space-y-6 text-ink/70 leading-relaxed">
          <p>Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <div>
            <h3 className="font-display text-ink text-lg mb-2">Information We Collect</h3>
            <p>We collect your name, email, phone number, and shipping address when you create an account or place an order, solely to process and deliver your orders.</p>
          </div>
          <div>
            <h3 className="font-display text-ink text-lg mb-2">How We Use Your Information</h3>
            <p>Your information is used to process orders, provide customer support, and send order-related communications. We do not sell your personal data to third parties.</p>
          </div>
          <div>
            <h3 className="font-display text-ink text-lg mb-2">Payment Security</h3>
            <p>All payments are processed securely through Razorpay. We do not store your card or payment details on our servers.</p>
          </div>
          <div>
            <h3 className="font-display text-ink text-lg mb-2">Data Security</h3>
            <p>Passwords are encrypted and never stored in plain text. We use industry-standard security practices to protect your data.</p>
          </div>
          <div>
            <h3 className="font-display text-ink text-lg mb-2">Contact Us</h3>
            <p>For any privacy-related concerns, reach out via our Contact Us page.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default PrivacyPage;
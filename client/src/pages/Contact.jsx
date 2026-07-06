import { motion } from 'framer-motion';

function Contact() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <p className="font-display uppercase tracking-[0.2em] text-xs text-madder mb-3">
          Get in Touch
        </p>
        <h1 className="font-body text-4xl text-ink mb-8">Contact Us</h1>

        <div className="space-y-6">
          <div>
            <h3 className="font-display uppercase tracking-wide text-xs text-ink/50 mb-2">
              Email
            </h3>
            <p className="text-ink/70">support@weavind.com</p>
          </div>
          <div>
            <h3 className="font-display uppercase tracking-wide text-xs text-ink/50 mb-2">
              Phone
            </h3>
            <p className="text-ink/70">+91 XXXXX XXXXX (Mon-Sat, 10 AM - 6 PM IST)</p>
          </div>
          <div>
            <h3 className="font-display uppercase tracking-wide text-xs text-ink/50 mb-2">
              Registered Address
            </h3>
            <p className="text-ink/70">
              Weavind, [Your Business Address], Nashik, Maharashtra, India
            </p>
          </div>
          <div>
            <h3 className="font-display uppercase tracking-wide text-xs text-ink/50 mb-2">
              Response Time
            </h3>
            <p className="text-ink/70">
              We typically respond to all queries within 24-48 hours.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Contact;
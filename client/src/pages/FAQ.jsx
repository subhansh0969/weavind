import { useState } from 'react';
import { motion } from 'framer-motion';

const FAQS = [
  {
    q: 'How do I track my order?',
    a: 'Go to "My Orders" from the navigation menu after logging in. You\'ll see a real-time status tracker for each order.',
  },
  {
    q: 'What is your return policy?',
    a: 'Most items can be returned within 7 days of delivery, unused and with original tags. See our Returns & Exchanges page for full details.',
  },
  {
    q: 'How long does delivery take?',
    a: 'Orders are typically delivered within 4-7 business days across India, with free shipping on all orders.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major cards, UPI, and net banking through our secure payment partner, Razorpay.',
  },
  {
    q: 'Can I change my order after placing it?',
    a: 'Please contact our support team as soon as possible after placing your order. We can accommodate changes if the order hasn\'t been shipped yet.',
  },
];

function FAQItem({ faq }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-ink/10 py-5">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-left"
      >
        <span className="font-body text-ink">{faq.q}</span>
        <span className="font-display text-xl text-ink/40">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="text-ink/70 mt-3 leading-relaxed overflow-hidden"
        >
          {faq.a}
        </motion.p>
      )}
    </div>
  );
}

function FAQ() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <p className="font-display uppercase tracking-[0.2em] text-xs text-madder mb-3">
          Help
        </p>
        <h1 className="font-body text-4xl text-ink mb-8">Frequently Asked Questions</h1>

        <div>
          {FAQS.map((faq, i) => (
            <FAQItem key={i} faq={faq} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default FAQ;
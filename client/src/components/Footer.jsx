import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-ink text-bone/70 mt-24">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand column */}
          <div className="col-span-2">
            <h3 className="font-display font-700 text-2xl tracking-tight text-bone mb-3">
              Weavind
            </h3>
            <p className="font-body text-sm text-bone/50 leading-relaxed max-w-xs">
              Made in India, made for the world. Thoughtfully woven clothing that carries craft and care in every thread.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-display uppercase tracking-wide text-xs text-gold mb-4">
              Shop
            </h4>
            <ul className="space-y-2.5 font-display text-sm">
              <li><Link to="/" className="hover:text-bone transition-colors">All Products</Link></li>
              <li><Link to="/?category=Men" className="hover:text-bone transition-colors">Men</Link></li>
              <li><Link to="/?category=Women" className="hover:text-bone transition-colors">Women</Link></li>
              <li><Link to="/?category=Kids" className="hover:text-bone transition-colors">Kids</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-display uppercase tracking-wide text-xs text-gold mb-4">
              Customer Service
            </h4>
            <ul className="space-y-2.5 font-display text-sm">
              <li><Link to="/contact" className="hover:text-bone transition-colors">Contact Us</Link></li>
              <li><Link to="/shipping-policy" className="hover:text-bone transition-colors">Shipping Policy</Link></li>
              <li><Link to="/returns-policy" className="hover:text-bone transition-colors">Returns & Exchanges</Link></li>
              <li><Link to="/faq" className="hover:text-bone transition-colors">FAQs</Link></li>
              <li><Link to="/my-orders" className="hover:text-bone transition-colors">Track Order</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display uppercase tracking-wide text-xs text-gold mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 font-display text-sm">
              <li><Link to="/about" className="hover:text-bone transition-colors">About Us</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-bone transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-bone transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-bone/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-display text-xs text-bone/40">
            © {new Date().getFullYear()} Weavind. All rights reserved.
          </p>
          <div className="flex items-center gap-4 font-display text-xs text-bone/40">
            <span>Secure Payments</span>
            <span className="w-1 h-1 rounded-full bg-bone/20" />
            <span>7 Day Returns</span>
            <span className="w-1 h-1 rounded-full bg-bone/20" />
            <span>Made in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
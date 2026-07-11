import { Link } from "react-router-dom";
import { FaInstagram, FaFacebookF, FaYoutube, FaPinterestP } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-ink text-bone border-t border-white/10 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <h2 className="text-xl font-bold tracking-widest text-white mb-4">WEAVIND</h2>
            <p className="text-xs text-bone/60 leading-relaxed max-w-xs">
              Premium clothing for modern India. Timeless craft in every thread.
            </p>
          </div>

          {/* Nav Columns - Tighter Spacing */}
          <div>
            <h3 className="uppercase tracking-widest text-[10px] text-gold mb-4 font-semibold">Shop</h3>
            <ul className="space-y-2 text-xs text-bone/70">
              <li><Link to="/" className="hover:text-white transition">New Arrivals</Link></li>
              <li><Link to="/?category=Men" className="hover:text-white transition">Men</Link></li>
              <li><Link to="/?category=Women" className="hover:text-white transition">Women</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="uppercase tracking-widest text-[10px] text-gold mb-4 font-semibold">Support</h3>
            <ul className="space-y-2 text-xs text-bone/70">
              <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
              <li><Link to="/shipping-policy" className="hover:text-white transition">Shipping</Link></li>
              <li><Link to="/faq" className="hover:text-white transition">FAQs</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="uppercase tracking-widest text-[10px] text-gold mb-4 font-semibold">Company</h3>
            <ul className="space-y-2 text-xs text-bone/70">
              <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link to="/terms" className="hover:text-white transition">Terms</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest text-bone/40">
          <p>© {new Date().getFullYear()} WEAVIND. All rights reserved.</p>
          <div className="flex gap-4">
            <FaInstagram /> <FaFacebookF /> <FaYoutube /> <FaPinterestP />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
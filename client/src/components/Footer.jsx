import { Link } from "react-router-dom";
import {
  FaInstagram,
  FaFacebookF,
  FaYoutube,
  FaPinterestP,
} from "react-icons/fa";
import { Mail, Phone, MapPin } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-[#0f0f0f] text-gray-400 mt-20 border-t border-white/10 font-body overflow-hidden">
      {/* Reduced vertical padding here (py-12 lg:py-16 instead of py-24) */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          
          {/* Brand Column */}
          <div className="lg:col-span-4 lg:pr-8">
            <h2 className="text-3xl font-bold tracking-[0.12em] text-white font-display">
              WEAVIND
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed max-w-sm text-gray-400">
              Premium clothing crafted for modern India. Timeless silhouettes, superior fabrics, and everyday luxury.
            </p>

            {/* Reduced mt-10 to mt-6, space-y-4 to space-y-3 */}
            <div className="space-y-3 mt-6 text-sm font-display tracking-wide">
              <div className="flex items-center gap-3">
                <MapPin size={18} strokeWidth={1.5} className="text-white flex-shrink-0" />
                Nashik, Maharashtra
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} strokeWidth={1.5} className="text-white flex-shrink-0" />
                +91 XXXXX XXXXX
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} strokeWidth={1.5} className="text-white flex-shrink-0" />
                support@weavind.com
              </div>
            </div>
          </div>

          {/* Shop Column */}
          <div className="lg:col-span-2">
            <h3 className="uppercase tracking-[0.2em] text-xs text-white mb-5 font-display font-semibold">
              Shop
            </h3>
            {/* Reduced space-y-4 to space-y-2.5 */}
            <ul className="space-y-2.5 font-display text-sm tracking-wide">
              <li>
                <Link to="/" className="hover:text-white transition-all duration-300 hover:translate-x-1 block w-fit focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white rounded-sm">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/?category=Men" className="hover:text-white transition-all duration-300 hover:translate-x-1 block w-fit focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white rounded-sm">
                  Men
                </Link>
              </li>
              <li>
                <Link to="/?category=Women" className="hover:text-white transition-all duration-300 hover:translate-x-1 block w-fit focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white rounded-sm">
                  Women
                </Link>
              </li>
              <li>
                <Link to="/?category=Kids" className="hover:text-white transition-all duration-300 hover:translate-x-1 block w-fit focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white rounded-sm">
                  Kids
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="lg:col-span-3">
            <h3 className="uppercase tracking-[0.2em] text-xs text-white mb-5 font-display font-semibold">
              Support
            </h3>
            <ul className="space-y-2.5 font-display text-sm tracking-wide">
              <li>
                <Link to="/contact" className="hover:text-white transition-all duration-300 hover:translate-x-1 block w-fit focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white rounded-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/shipping-policy" className="hover:text-white transition-all duration-300 hover:translate-x-1 block w-fit focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white rounded-sm">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/returns-policy" className="hover:text-white transition-all duration-300 hover:translate-x-1 block w-fit focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white rounded-sm">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-all duration-300 hover:translate-x-1 block w-fit focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white rounded-sm">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/my-orders" className="hover:text-white transition-all duration-300 hover:translate-x-1 block w-fit focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white rounded-sm">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="lg:col-span-3">
            <h3 className="uppercase tracking-[0.2em] text-xs text-white mb-5 font-display font-semibold">
              Company
            </h3>
            <ul className="space-y-2.5 font-display text-sm tracking-wide">
              <li>
                <Link to="/about" className="hover:text-white transition-all duration-300 hover:translate-x-1 block w-fit focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white rounded-sm">
                  About Weavind
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-white transition-all duration-300 hover:translate-x-1 block w-fit focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white rounded-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-all duration-300 hover:translate-x-1 block w-fit focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white rounded-sm">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section - Reduced top margins */}
        <div className="border-t border-white/10 mt-10 pt-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-semibold text-white font-display tracking-wide">
              Join the WEAVIND Club
            </h3>
            <p className="mt-2 text-sm text-gray-400 font-body">
              Exclusive drops, early access, and premium fashion inspiration.
            </p>
          </div>

          <form className="flex w-full lg:w-auto" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="newsletter-email" className="sr-only">Email address for newsletter</label>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="Enter your email"
              className="bg-[#181818] border border-white/10 px-5 h-12 rounded-l-md w-full md:w-80 outline-none focus:border-white text-white font-display text-sm transition-colors"
            />
            <button
              type="submit"
              className="bg-white text-black px-6 sm:px-8 rounded-r-md font-display text-xs uppercase tracking-widest font-semibold hover:bg-gray-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f0f0f] whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Bottom Section - Reduced top margins */}
        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col-reverse md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-500 font-display">
              © {new Date().getFullYear()} WEAVIND. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 sm:gap-3 text-[11px] text-gray-600 mt-2 font-display uppercase tracking-[0.15em]">
              <span>Made in India</span>
              <span>•</span>
              <span>Secure Payments</span>
              <span>•</span>
              <span>Fast Delivery</span>
            </div>
          </div>

          <div className="flex gap-4">
            {[
              { icon: <FaInstagram size={18} />, link: "#", name: "Instagram" },
              { icon: <FaFacebookF size={18} />, link: "#", name: "Facebook" },
              { icon: <FaYoutube size={18} />, link: "#", name: "YouTube" },
              { icon: <FaPinterestP size={18} />, link: "#", name: "Pinterest" },
            ].map((item, index) => (
              <a
                key={index}
                href={item.link}
                aria-label={`Follow Weavind on ${item.name}`}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:bg-white hover:text-black hover:border-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f0f0f]"
              >
                {item.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
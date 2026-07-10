import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

function Navbar() {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // Close menus when route changes
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname, location.search]);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  const closeMenu = () => setMenuOpen(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchValue.trim();
    navigate(query ? `/?search=${encodeURIComponent(query)}` : '/');
    setSearchOpen(false);
    setMenuOpen(false);
    
    // Existing logic retained to preserve functionality
    setTimeout(() => {
      document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    {/* Removed overflow-x-hidden to prevent clipping of absolute dropdowns */},
    <nav className="sticky top-0 z-50 bg-bone/90 backdrop-blur-md border-b border-ink/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        
        {/* Brand */}
        <Link 
          to="/" 
          className="font-display font-700 text-xl sm:text-2xl tracking-tight text-ink flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm px-1"
        >
          Weavind
        </Link>

        {/* Desktop Links with Premium Micro-interactions */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8 font-display text-sm uppercase tracking-wide text-ink/70 flex-shrink-0">
          {['Men', 'Women', 'Kids', 'Unisex'].map((category) => (
            <Link 
              key={category}
              to={`/?category=${category}`} 
              className="relative group py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm"
            >
              <span className="group-hover:text-ink transition-colors duration-300">{category}</span>
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-ink scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left" />
            </Link>
          ))}
        </div>

        {/* Icons & Actions */}
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          {/* Search Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSearchOpen(!searchOpen);
              setMenuOpen(false);
            }}
            className="w-9 h-9 rounded-full border border-ink/15 flex items-center justify-center flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold transition-colors hover:border-ink/30"
            aria-label="Search"
            aria-expanded={searchOpen}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#161616" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </motion.button>

          {/* Desktop User Nav */}
          {user ? (
            <div className="hidden lg:flex items-center gap-3 xl:gap-4">
              {user.role === 'admin' && (
                <Link to="/admin" className="font-display text-xs uppercase tracking-wide text-gold hover:text-ink transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm px-1">
                  Admin
                </Link>
              )}
              <Link to="/my-orders" className="font-display text-xs uppercase tracking-wide text-ink/70 hover:text-ink transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm px-1">
                Orders
              </Link>
              <span className="font-display text-sm text-ink/70 whitespace-nowrap px-1">
                Hi, {user.name.split(' ')[0]}
              </span>
              <button onClick={handleLogout} className="font-display text-xs uppercase tracking-wide text-ink/50 hover:text-madder transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-madder rounded-sm px-1">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="hidden lg:block font-display text-xs uppercase tracking-wide text-ink/70 hover:text-ink transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm px-1">
              Login
            </Link>
          )}

          {/* Wishlist Icon */}
          {user && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/wishlist"
                aria-label="Wishlist"
                className="relative w-9 h-9 rounded-full border border-ink/15 flex items-center justify-center cursor-pointer flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold transition-colors hover:border-ink/30"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#161616" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-madder text-white text-[10px] font-display w-5 h-5 rounded-full flex items-center justify-center border-2 border-bone">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            </motion.div>
          )}

          {/* Cart Icon */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/cart"
              aria-label="Cart"
              className="relative w-9 h-9 rounded-full bg-indigo flex items-center justify-center cursor-pointer flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo transition-colors hover:bg-indigo/90"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-madder text-white text-[10px] font-display w-5 h-5 rounded-full flex items-center justify-center border-2 border-bone">
                  {cartCount}
                </span>
              )}
            </Link>
          </motion.div>

          {/* Hamburger button */}
          <button
            onClick={() => {
              setMenuOpen(!menuOpen);
              setSearchOpen(false);
            }}
            className="lg:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm"
            aria-label="Menu"
            aria-expanded={menuOpen}
          >
            <span className={`w-6 h-0.5 bg-ink rounded-full transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`w-6 h-0.5 bg-ink rounded-full transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`w-6 h-0.5 bg-ink rounded-full transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Expanding Search Bar (Absolute to prevent layout shift) */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 w-full bg-bone/95 backdrop-blur-md border-b border-ink/10 shadow-sm z-40"
          >
            <form onSubmit={handleSearchSubmit} className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#161616" strokeWidth="2" className="flex-shrink-0 text-ink/40">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                autoFocus
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search for products, categories..."
                className="flex-1 bg-transparent font-display text-sm focus:outline-none placeholder:text-ink/40 text-ink"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="font-display text-xs uppercase tracking-wide text-ink/50 hover:text-madder transition-colors flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-madder rounded-sm px-1"
              >
                Close
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile/Tablet Menu Panel (Absolute to prevent layout shift) */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 w-full lg:hidden bg-bone/95 backdrop-blur-md border-b border-ink/10 shadow-xl z-40"
          >
            <div className="px-4 sm:px-6 py-6 flex flex-col gap-5">
              {['Men', 'Women', 'Kids', 'Unisex'].map((category) => (
                <Link 
                  key={category} 
                  onClick={closeMenu} 
                  to={`/?category=${category}`} 
                  className="font-display text-base uppercase tracking-wide text-ink/80 hover:text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm w-fit"
                >
                  {category}
                </Link>
              ))}

              <div className="border-t border-ink/10 my-2" />

              {user ? (
                <div className="flex flex-col gap-5">
                  <p className="font-display text-sm text-ink/50">
                    Logged in as <span className="text-ink/80">{user.name}</span>
                  </p>
                  <Link onClick={closeMenu} to="/my-orders" className="font-display text-sm uppercase tracking-wide text-ink/80 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm w-fit">
                    My Orders
                  </Link>
                  <Link onClick={closeMenu} to="/wishlist" className="font-display text-sm uppercase tracking-wide text-ink/80 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm w-fit">
                    Wishlist {wishlistCount > 0 && <span className="text-madder">({wishlistCount})</span>}
                  </Link>
                  {user.role === 'admin' && (
                    <Link onClick={closeMenu} to="/admin" className="font-display text-sm uppercase tracking-wide text-gold hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm w-fit">
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="font-display text-sm uppercase tracking-wide text-madder text-left w-fit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-madder rounded-sm"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link onClick={closeMenu} to="/login" className="font-display text-base uppercase tracking-wide text-indigo hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo rounded-sm w-fit">
                  Login / Register
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Screen darkening overlay when menus are open (Mobile focus trap) */}
      <AnimatePresence>
        {(searchOpen || menuOpen) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setSearchOpen(false);
              setMenuOpen(false);
            }}
            className="fixed inset-0 top-[100%] bg-ink/20 z-30 lg:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Signature Thread Line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={{ transformOrigin: "left" }}
        className="h-[2px] bg-gradient-to-r from-madder via-gold to-indigo"
      />
    </nav>
  );
}

export default Navbar;
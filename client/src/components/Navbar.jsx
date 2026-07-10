import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

function Navbar() {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

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
    setTimeout(() => {
      document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <nav className="sticky top-0 z-50 bg-bone/90 backdrop-blur-md border-b border-ink/10 overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link to="/" className="font-display font-700 text-xl sm:text-2xl tracking-tight text-ink flex-shrink-0">
          Weavind
        </Link>

        <div className="hidden lg:flex items-center gap-6 xl:gap-8 font-display text-sm uppercase tracking-wide text-ink/70 flex-shrink-0">
          <Link to="/?category=Men" className="hover:text-indigo transition-colors">Men</Link>
          <Link to="/?category=Women" className="hover:text-indigo transition-colors">Women</Link>
          <Link to="/?category=Kids" className="hover:text-indigo transition-colors">Kids</Link>
          <Link to="/?category=Unisex" className="hover:text-indigo transition-colors">Unisex</Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSearchOpen(!searchOpen)}
            className="w-9 h-9 rounded-full border border-ink/15 flex items-center justify-center flex-shrink-0"
            aria-label="Search"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#161616" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </motion.button>

          {user ? (
            <div className="hidden lg:flex items-center gap-3 xl:gap-4">
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className="font-display text-xs uppercase tracking-wide text-gold hover:text-indigo transition-colors whitespace-nowrap"
                >
                  Admin
                </Link>
              )}
              <Link
                to="/my-orders"
                className="font-display text-xs uppercase tracking-wide text-ink/70 hover:text-indigo transition-colors whitespace-nowrap"
              >
                Orders
              </Link>
              <span className="font-display text-sm text-ink/70 whitespace-nowrap">
                Hi, {user.name.split(' ')[0]}
              </span>
              <button
                onClick={handleLogout}
                className="font-display text-xs uppercase tracking-wide text-ink/50 hover:text-madder transition-colors whitespace-nowrap"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden lg:block font-display text-xs uppercase tracking-wide text-ink/70 hover:text-indigo transition-colors whitespace-nowrap"
            >
              Login
            </Link>
          )}

          {user && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/wishlist')}
              className="relative w-9 h-9 rounded-full border border-ink/15 flex items-center justify-center cursor-pointer flex-shrink-0"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#161616" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-madder text-white text-[10px] font-display w-5 h-5 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </motion.div>
          )}

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/cart')}
            className="relative w-9 h-9 rounded-full bg-indigo flex items-center justify-center cursor-pointer flex-shrink-0"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-madder text-white text-[10px] font-display w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </motion.div>

          {/* Hamburger button - shows below lg now */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 flex-shrink-0"
            aria-label="Menu"
          >
            <span
              className={
                menuOpen
                  ? 'w-6 h-0.5 bg-ink rounded-full transition-all rotate-45 translate-y-2'
                  : 'w-6 h-0.5 bg-ink rounded-full transition-all'
              }
            />
            <span
              className={
                menuOpen
                  ? 'w-6 h-0.5 bg-ink rounded-full transition-all opacity-0'
                  : 'w-6 h-0.5 bg-ink rounded-full transition-all'
              }
            />
            <span
              className={
                menuOpen
                  ? 'w-6 h-0.5 bg-ink rounded-full transition-all -rotate-45 -translate-y-2'
                  : 'w-6 h-0.5 bg-ink rounded-full transition-all'
              }
            />
          </button>
        </div>
      </div>

      {/* Expanding search bar */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-ink/10 bg-bone"
          >
            <form
              onSubmit={handleSearchSubmit}
              className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3"
            >
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
                className="flex-1 bg-transparent font-display text-sm focus:outline-none placeholder:text-ink/40"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="font-display text-xs uppercase tracking-wide text-ink/50 hover:text-madder transition-colors flex-shrink-0"
              >
                Close
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile/tablet menu panel - shows below lg now */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden overflow-hidden border-t border-ink/10 bg-bone"
          >
            <div className="px-4 sm:px-6 py-5 flex flex-col gap-4">
              <Link onClick={closeMenu} to="/?category=Men" className="font-display text-sm uppercase tracking-wide text-ink/70">
                Men
              </Link>
              <Link onClick={closeMenu} to="/?category=Women" className="font-display text-sm uppercase tracking-wide text-ink/70">
                Women
              </Link>
              <Link onClick={closeMenu} to="/?category=Kids" className="font-display text-sm uppercase tracking-wide text-ink/70">
                Kids
              </Link>
              <Link onClick={closeMenu} to="/?category=Unisex" className="font-display text-sm uppercase tracking-wide text-ink/70">
                Unisex
              </Link>

              <div className="border-t border-ink/10 my-1" />

              {user ? (
                <>
                  <p className="font-display text-sm text-ink/50">
                    Hi, {user.name.split(' ')[0]}
                  </p>
                  <Link onClick={closeMenu} to="/my-orders" className="font-display text-sm uppercase tracking-wide text-ink/70">
                    My Orders
                  </Link>
                  <Link onClick={closeMenu} to="/wishlist" className="font-display text-sm uppercase tracking-wide text-ink/70">
                    Wishlist {wishlistCount > 0 ? '(' + wishlistCount + ')' : ''}
                  </Link>
                  {user.role === 'admin' && (
                    <Link onClick={closeMenu} to="/admin" className="font-display text-sm uppercase tracking-wide text-gold">
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="font-display text-sm uppercase tracking-wide text-madder text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link onClick={closeMenu} to="/login" className="font-display text-sm uppercase tracking-wide text-indigo">
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* signature thread line */}
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
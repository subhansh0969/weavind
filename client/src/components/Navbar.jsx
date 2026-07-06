import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 bg-bone/90 backdrop-blur-md border-b border-ink/10">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="font-display font-700 text-2xl tracking-tight text-ink">
          Weavind
        </Link>

        <div className="hidden md:flex items-center gap-8 font-display text-sm uppercase tracking-wide text-ink/70">
          <span className="cursor-pointer hover:text-indigo transition-colors">Men</span>
          <span className="cursor-pointer hover:text-indigo transition-colors">Women</span>
          <span className="cursor-pointer hover:text-indigo transition-colors">Kids</span>
          <span className="cursor-pointer hover:text-indigo transition-colors">Unisex</span>
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          {user ? (
            <div className="hidden md:flex items-center gap-4">
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className="font-display text-xs uppercase tracking-wide text-gold hover:text-indigo transition-colors"
                >
                  Admin
                </Link>
              )}
              <Link
                to="/my-orders"
                className="font-display text-xs uppercase tracking-wide text-ink/70 hover:text-indigo transition-colors"
              >
                My Orders
              </Link>
              <span className="font-display text-sm text-ink/70">
                Hi, {user.name.split(' ')[0]}
              </span>
              <button
                onClick={handleLogout}
                className="font-display text-xs uppercase tracking-wide text-ink/50 hover:text-madder transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden md:block font-display text-xs uppercase tracking-wide text-ink/70 hover:text-indigo transition-colors"
            >
              Login
            </Link>
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

          {/* Hamburger button - mobile only */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 flex-shrink-0"
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

      {/* Mobile menu panel */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden border-t border-ink/10 bg-bone"
          >
            <div className="px-6 py-5 flex flex-col gap-4">
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

async function noop() {}

export default Navbar;
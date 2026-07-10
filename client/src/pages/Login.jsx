import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import PasswordInput from '../components/PasswordInput';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-20 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <p className="font-display uppercase tracking-[0.2em] text-[10px] text-madder mb-4 flex items-center gap-2">
          <span className="w-4 h-[1px] bg-madder block" />
          Welcome Back
        </p>
        <h1 className="font-body text-3xl sm:text-4xl text-ink mb-10 leading-tight">Sign in to Weavind</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label htmlFor="email" className="font-display text-[11px] uppercase tracking-widest text-ink/70 ml-1 block">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full px-4 py-3.5 border border-ink/15 rounded-sm focus:outline-none focus:border-indigo focus:ring-1 focus:ring-indigo bg-bone/30 font-display text-sm text-ink transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="font-display text-[11px] uppercase tracking-widest text-ink/70 ml-1 block">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="font-display text-[11px] uppercase tracking-widest text-indigo hover:text-ink transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo rounded-sm px-1 -mr-1"
              >
                Forgot?
              </Link>
            </div>
            <PasswordInput
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="bg-madder/5 border border-madder/20 p-4 rounded-sm flex items-start gap-3 mt-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-madder mt-0.5 flex-shrink-0">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p className="text-madder text-sm font-display">{error}</p>
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={loading}
            className="w-full mt-8 py-4.5 bg-ink text-bone font-display uppercase tracking-widest text-xs rounded-sm hover:bg-indigo transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </motion.button>
        </form>

        <div className="mt-10 pt-8 border-t border-ink/10 text-center">
          <p className="font-display text-xs uppercase tracking-widest text-ink/50">
            New to Weavind?{' '}
            <Link to="/register" className="text-indigo font-600 hover:text-ink transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo rounded-sm px-1">
              Create an account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;
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
    <div className="max-w-md mx-auto px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="font-display uppercase tracking-[0.2em] text-xs text-madder mb-3">
          Welcome Back
        </p>
        <h1 className="font-body text-3xl text-ink mb-8">Sign in to Weavind</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-display text-xs uppercase tracking-wide text-ink/50 block mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-ink/20 rounded-sm focus:outline-none focus:border-indigo bg-transparent"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-display text-xs uppercase tracking-wide text-ink/50">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="font-display text-xs text-indigo hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-madder text-sm font-display bg-madder/10 border border-madder/20 rounded-sm px-4 py-3">
              {error}
            </p>
          )}

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-ink text-bone font-display uppercase tracking-wide text-sm rounded-sm hover:bg-indigo transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </motion.button>
        </form>

        <p className="font-display text-sm text-ink/60 mt-6 text-center">
          New to Weavind?{' '}
          <Link to="/register" className="text-indigo hover:underline">
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;
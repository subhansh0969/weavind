import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../api/axios';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const res = await API.post('/password/forgot', { email });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <p className="font-display uppercase tracking-[0.2em] text-xs text-madder mb-3">
          Reset Password
        </p>
        <h1 className="font-body text-3xl text-ink mb-4">Forgot your password?</h1>
        <p className="text-ink/60 mb-8 text-sm">
          Enter your email and we'll send you a link to reset it.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-ink/20 rounded-sm focus:outline-none focus:border-indigo bg-transparent"
          />

          {message && (
            <p className="text-indigo text-sm font-display bg-indigo/10 border border-indigo/20 rounded-sm px-4 py-3">
              {message}
            </p>
          )}
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
            {loading ? 'Sending...' : 'Send Reset Link'}
          </motion.button>
        </form>

        <p className="font-display text-sm text-ink/60 mt-6 text-center">
          <Link to="/login" className="text-indigo hover:underline">
            Back to Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default ForgotPassword;
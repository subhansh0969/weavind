import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../api/axios';
import PasswordStrength from '../components/PasswordStrength';
import PasswordInput from '../components/PasswordInput';

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await API.post('/password/reset/' + token, { password });
      setMessage(res.data.message);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
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
        <h1 className="font-body text-3xl text-ink mb-8">Set a new password</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
              required
              minLength={6}
            />
            <PasswordStrength password={password} />
          </div>

          <PasswordInput
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            required
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
            {loading ? 'Resetting...' : 'Reset Password'}
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

export default ResetPassword;
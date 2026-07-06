import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import StarRating from './StarRating';
import ImageUrlInput from './ImageUrlInput';

function ProductReviews({ productId }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [newImages, setNewImages] = useState([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await API.get('/reviews/' + productId);
      setReviews(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newRating === 0) {
      setError('Please select a star rating');
      return;
    }

    setSubmitting(true);
    try {
      await API.post('/reviews/' + productId, {
        rating: newRating,
        comment: newComment,
        images: newImages,
      });
      setNewRating(0);
      setNewComment('');
      setNewImages([]);
      setShowForm(false);
      fetchReviews();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId) => {
    const confirmed = window.confirm('Delete this review?');
    if (!confirmed) return;
    try {
      await API.delete('/reviews/' + reviewId);
      fetchReviews();
    } catch (err) {
      window.alert('Failed to delete review');
    }
  };

  const openImageInNewTab = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 border-t border-ink/10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="font-body text-xl sm:text-2xl text-ink mb-2">Customer Reviews</h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2">
              <StarRating rating={avgRating} size={18} />
              <span className="font-display text-sm text-ink/60">
                {avgRating.toFixed(1)} · {reviews.length} review{reviews.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>

        {user && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full sm:w-auto px-5 py-2.5 bg-ink text-bone font-display uppercase tracking-wide text-xs rounded-sm hover:bg-indigo transition-colors"
          >
            Write a Review
          </button>
        )}
      </div>

      {!user && (
        <p className="font-display text-sm text-ink/50 mb-8">
          Please sign in to write a review.
        </p>
      )}

      {showForm && (
        <motion.form
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="border border-ink/10 rounded-sm p-4 sm:p-6 mb-8"
        >
          <p className="font-display text-xs uppercase tracking-wide text-ink/50 mb-2">
            Your Rating
          </p>
          <StarRating rating={newRating} size={24} interactive onChange={setNewRating} />

          <p className="font-display text-xs uppercase tracking-wide text-ink/50 mb-2 mt-5">
            Your Review
          </p>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            required
            rows={4}
            placeholder="Share your experience with this product..."
            className="w-full px-4 py-3 border border-ink/20 rounded-sm focus:outline-none focus:border-indigo bg-transparent"
          />

          <p className="font-display text-xs uppercase tracking-wide text-ink/50 mb-2 mt-5">
            Add Photos (optional)
          </p>
          <ImageUrlInput images={newImages} onChange={setNewImages} />

          {error && (
            <p className="text-madder text-sm font-display mt-3">{error}</p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-6 py-2.5 bg-ink text-bone font-display uppercase tracking-wide text-xs rounded-sm hover:bg-indigo transition-colors disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="w-full sm:w-auto px-6 py-2.5 font-display uppercase tracking-wide text-xs text-ink/50 hover:text-ink transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.form>
      )}

      {loading ? (
        <p className="font-display text-sm text-ink/50">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="font-display text-sm text-ink/50">
          No reviews yet. Be the first to share your thoughts!
        </p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review._id} className="border-b border-ink/10 pb-6">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <p className="font-body text-ink">{review.userName}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <StarRating rating={review.rating} size={14} />
                    <span className="font-display text-xs text-ink/40">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {user && user._id === review.user && (
                  <button
                    onClick={() => handleDelete(review._id)}
                    className="font-display text-xs uppercase tracking-wide text-ink/30 hover:text-madder transition-colors flex-shrink-0"
                  >
                    Delete
                  </button>
                )}
              </div>
              <p className="text-ink/70 text-sm leading-relaxed mb-3">{review.comment}</p>
              {review.images && review.images.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {review.images.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => openImageInNewTab(url)}
                      className="block w-16 h-16 rounded-sm overflow-hidden border border-ink/10"
                    >
                      <img
                        src={url}
                        alt={'Review photo ' + (idx + 1)}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductReviews;
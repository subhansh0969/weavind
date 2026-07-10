import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    if (!user) {
      setWishlist([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await API.get('/wishlist');
      setWishlist(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const isWishlisted = (productId) => {
    return wishlist.some((p) => p._id === productId);
  };

  const toggleWishlist = async (productId) => {
    if (!user) return false;

    const alreadyIn = isWishlisted(productId);
    try {
      if (alreadyIn) {
        await API.delete('/wishlist/' + productId);
        setWishlist((prev) => prev.filter((p) => p._id !== productId));
      } else {
        await API.post('/wishlist/' + productId);
        fetchWishlist();
      }
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, loading, isWishlisted, toggleWishlist, wishlistCount: wishlist.length }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
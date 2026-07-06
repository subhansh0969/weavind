import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';
import FilterBar from '../components/FilterBar';
import TrustBadges from '../components/TrustBadges';
import BrandStory from '../components/BrandStory';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    productType: '',
    search: '',
    minPrice: '',
    maxPrice: '',
    sort: 'newest',
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (filters.category) params.category = filters.category;
        if (filters.productType) params.productType = filters.productType;
        if (filters.search) params.search = filters.search;
        if (filters.minPrice) params.minPrice = filters.minPrice;
        if (filters.maxPrice) params.maxPrice = filters.maxPrice;
        if (filters.sort) params.sort = filters.sort;

        const response = await API.get('/products', { params });
        setProducts(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filters]);

  return (
    <div>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-16">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="font-display uppercase tracking-[0.2em] text-xs text-madder mb-4"
        >
          Made in India · Made for the World
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-body text-5xl md:text-7xl leading-[1.05] text-ink max-w-2xl"
        >
          Woven with care, worn everywhere.
        </motion.h1>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{ transformOrigin: "left" }}
          className="h-[2px] w-32 bg-indigo mt-8"
        />
      </section>

      <TrustBadges />

      {/* Products */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="font-display uppercase tracking-wide text-sm text-ink/50 mb-6">
          The Collection
        </h2>

        <FilterBar filters={filters} onChange={setFilters} />

        {loading && <p className="font-display text-ink/50">Loading products...</p>}
        {error && <p className="font-display text-madder">{error}</p>}

        {!loading && products.length === 0 && (
          <p className="font-display text-ink/50 py-12 text-center">
            No products match your filters. Try adjusting your search.
          </p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product, i) => (
            <ProductCard key={product._id} product={product} index={i} />
          ))}
        </div>
      </section>

      <BrandStory />
    </div>
  );
}

export default Home;
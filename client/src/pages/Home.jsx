import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';
import FilterBar from '../components/FilterBar';
import TrustBadges from '../components/TrustBadges';
import BrandStory from '../components/BrandStory';
import CategoryTiles from '../components/CategoryTiles';
import ProductCardSkeleton from '../components/ProductCardSkeleton';

function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    productType: '',
    search: searchParams.get('search') || '',
    minPrice: '',
    maxPrice: '',
    sort: 'newest',
  });

  useEffect(() => {
    const urlCategory = searchParams.get('category') || '';
    const urlSearch = searchParams.get('search') || '';
    setFilters((prev) => ({ ...prev, category: urlCategory, search: urlSearch, productType: '' }));
  }, [searchParams]);

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
        setError('We encountered an issue loading the collection. Please try refreshing.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    if (newFilters.category || newFilters.search) {
      const params = {};
      if (newFilters.category) params.category = newFilters.category;
      if (newFilters.search) params.search = newFilters.search;
      setSearchParams(params);
    } else {
      setSearchParams({});
    }
  };

  const clearAllFilters = () => {
    handleFilterChange({
      category: '',
      productType: '',
      search: '',
      minPrice: '',
      maxPrice: '',
      sort: 'newest',
    });
  };

  const scrollToCollection = () => {
    document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-16 sm:pb-24 flex flex-col items-start">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="font-display uppercase tracking-[0.2em] text-xs text-madder mb-5"
        >
          Made in India · Made for the World
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-body text-4xl sm:text-5xl md:text-7xl leading-[1.05] text-ink max-w-3xl"
        >
          Woven with care, <br className="hidden sm:block" />worn everywhere.
        </motion.h1>
        
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          style={{ transformOrigin: "left" }}
          className="h-[2px] w-32 bg-indigo mt-8 mb-10"
        />

        {/* Hero CTA */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          onClick={scrollToCollection}
          className="group inline-flex items-center justify-center px-8 py-3.5 bg-ink text-bone font-display uppercase tracking-widest text-xs hover:bg-indigo transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm shadow-sm"
        >
          Explore Collection
          <svg className="ml-3 w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </motion.button>
      </section>

      <TrustBadges />
      <CategoryTiles />

      {/* Collection Section */}
      <section id="collection" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 scroll-mt-20">
        <div className="flex items-end justify-between mb-8">
          <h2 className="font-display uppercase tracking-wide text-sm text-ink/60">
            The Collection
          </h2>
          {!loading && products.length > 0 && (
            <span className="font-display text-xs text-ink/40 tracking-wider">
              {products.length} {products.length === 1 ? 'Item' : 'Items'}
            </span>
          )}
        </div>

        <FilterBar filters={filters} onChange={handleFilterChange} />

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="mt-8 bg-madder/5 border border-madder/10 py-12 px-4 rounded-sm flex flex-col items-center text-center">
            <svg className="w-8 h-8 text-madder/40 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="font-display text-sm text-madder/80 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="font-display text-xs uppercase tracking-wide text-ink/60 hover:text-ink underline underline-offset-4 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold"
            >
              Refresh Page
            </button>
          </div>
        )}

        {/* Empty State (0 Results) */}
        {!loading && !error && products.length === 0 && (
          <div className="mt-8 py-20 px-4 flex flex-col items-center text-center bg-bone/40 border border-ink/5 rounded-sm">
            <svg className="w-10 h-10 text-ink/20 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="font-display text-lg text-ink font-600 mb-2">No items found</h3>
            <p className="font-body text-ink/60 max-w-sm mb-6 text-sm">
              We couldn't find anything matching your current filters or search terms.
            </p>
            <button
              onClick={clearAllFilters}
              className="font-display uppercase tracking-wider text-xs border border-ink/20 px-6 py-2.5 text-ink hover:bg-ink hover:text-bone hover:border-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 sm:gap-6 mt-8">
            {products.map((product, i) => (
              <ProductCard key={product._id} product={product} index={i} />
            ))}
          </div>
        )}
      </section>

      <BrandStory />
    </div>
  );
}

export default Home;
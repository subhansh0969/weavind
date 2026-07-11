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
    <div className="bg-bone min-h-screen text-ink selection:bg-ink selection:text-bone">
      
      {/* 1. Hero Section: Upgraded to a Centered, Editorial Layout */}
      <section className="relative min-h-[65vh] flex flex-col items-center justify-center text-center px-6 pt-16 pb-20 border-b border-ink/10">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="font-display uppercase tracking-[0.3em] text-[11px] text-madder mb-6 font-semibold"
        >
          Made in India · Made for the World
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-body text-5xl sm:text-6xl md:text-7xl leading-[1.08] text-ink max-w-4xl tracking-tight mb-8"
        >
          Woven with care, <br className="hidden sm:block" />worn everywhere.
        </motion.h1>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          onClick={scrollToCollection}
          className="group inline-flex items-center justify-center px-8 py-3.5 bg-ink text-bone font-display uppercase tracking-widest text-xs hover:bg-indigo transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm shadow-sm"
        >
          Explore Collection
          <svg className="ml-3 w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </motion.button>
      </section>

      {/* 2. Visual Rhythm Spacing for Trust & Categories */}
      <div className="max-w-7xl mx-auto px-6 space-y-16 py-16">
        <TrustBadges />
        <CategoryTiles />
      </div>

      {/* 3. Collection Section: Increased to max-w-7xl for breathing room */}
      <section id="collection" className="max-w-7xl mx-auto px-6 py-16 scroll-mt-20 border-t border-ink/10">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="font-display uppercase tracking-widest text-[10px] text-madder block mb-1">
              Spring / Summer 2026
            </span>
            <h2 className="font-body text-3xl sm:text-4xl text-ink">
              The Collection
            </h2>
          </div>
          {!loading && products.length > 0 && (
            <span className="font-display text-xs text-ink/40 tracking-wider">
              {products.length} {products.length === 1 ? 'Piece' : 'Pieces'}
            </span>
          )}
        </div>

        {/* Your Modular Filter Bar */}
        <FilterBar filters={filters} onChange={handleFilterChange} />

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12 mt-10">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error State: Editorial border style */}
        {error && !loading && (
          <div className="mt-10 bg-madder/5 border border-madder/20 py-16 px-4 rounded-sm flex flex-col items-center text-center">
            <p className="font-body text-lg text-madder mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-ink text-bone font-display text-xs uppercase tracking-widest"
            >
              Refresh Page
            </button>
          </div>
        )}

        {/* Empty State: Polished Architecture */}
        {!loading && !error && products.length === 0 && (
          <div className="mt-10 py-24 px-4 flex flex-col items-center text-center border border-dashed border-ink/20 rounded-sm">
            <h3 className="font-body text-2xl text-ink mb-2">No pieces found</h3>
            <p className="font-display text-xs text-ink/60 max-w-sm mb-6 leading-relaxed">
              We couldn't find anything matching your current filters or search terms. Try widening your criteria.
            </p>
            <button
              onClick={clearAllFilters}
              className="font-display uppercase tracking-widest text-xs bg-ink px-6 py-3 text-bone hover:bg-indigo transition-colors rounded-sm"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Products Grid: Wider gap-y-12 to make items feel luxurious */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12 mt-10">
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
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
import HeroCarousel from '../components/HeroCarousel';

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
        setError('Failed to load products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    if (newFilters.category) {
      setSearchParams({ category: newFilters.category });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div>
      {/* Hero */}
      <HeroCarousel />

      <TrustBadges />

      <CategoryTiles />

      {/* Products */}
      <section id="collection" className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h2 className="font-display uppercase tracking-wide text-sm text-ink/50 mb-6">
          The Collection
        </h2>

        <FilterBar filters={filters} onChange={handleFilterChange} />

        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        )}
        {error && <p className="font-display text-madder">{error}</p>}

        {!loading && products.length === 0 && (
          <p className="font-display text-ink/50 py-12 text-center">
            No products match your filters. Try adjusting your search.
          </p>
        )}

        {!loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
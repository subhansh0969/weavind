import { useState, useEffect } from 'react';
import API from '../api/axios';

const CATEGORIES = ['All', 'Men', 'Women', 'Kids', 'Unisex'];

function FilterBar({ filters, onChange }) {
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const [availableTypes, setAvailableTypes] = useState([]);

  useEffect(() => {
    if (filters.category) {
      API.get('/products/types/' + filters.category)
        .then((res) => setAvailableTypes(res.data))
        .catch(() => setAvailableTypes([]));
    } else {
      setAvailableTypes([]);
    }
  }, [filters.category]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onChange({ ...filters, search: searchInput });
  };

  const handleCategoryClick = (value) => {
    // Reset productType when category changes since type list changes too
    onChange({ ...filters, category: value, productType: '' });
  };

  return (
    <div className="mb-8 space-y-4">
      {/* Search bar */}
      <form onSubmit={handleSearchSubmit} className="relative max-w-md">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search products..."
          className="w-full pl-10 pr-4 py-2.5 border border-ink/20 rounded-sm focus:outline-none focus:border-indigo bg-transparent text-sm"
        />
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </form>

      {/* Category + Sort row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const value = cat === 'All' ? '' : cat;
            const isActive = filters.category === value;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryClick(value)}
                className={
                  isActive
                    ? 'px-4 py-2 rounded-full font-display text-xs uppercase tracking-wide bg-indigo text-white'
                    : 'px-4 py-2 rounded-full font-display text-xs uppercase tracking-wide border border-ink/20 text-ink/60 hover:border-indigo/50'
                }
              >
                {cat}
              </button>
            );
          })}
        </div>

        <select
          value={filters.sort || 'newest'}
          onChange={(e) => onChange({ ...filters, sort: e.target.value })}
          className="px-4 py-2 border border-ink/20 rounded-sm font-display text-xs uppercase tracking-wide text-ink/70 bg-transparent focus:outline-none focus:border-indigo"
        >
          <option value="newest">Newest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>

      {/* Product Type pills - only show when a category is selected and types exist */}
      {filters.category && availableTypes.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onChange({ ...filters, productType: '' })}
            className={
              !filters.productType
                ? 'px-3 py-1.5 rounded-full font-display text-[11px] uppercase tracking-wide bg-ink text-bone'
                : 'px-3 py-1.5 rounded-full font-display text-[11px] uppercase tracking-wide border border-ink/15 text-ink/50 hover:border-ink/40'
            }
          >
            All Types
          </button>
          {availableTypes.map((type) => (
            <button
              key={type}
              onClick={() => onChange({ ...filters, productType: type })}
              className={
                filters.productType === type
                  ? 'px-3 py-1.5 rounded-full font-display text-[11px] uppercase tracking-wide bg-ink text-bone'
                  : 'px-3 py-1.5 rounded-full font-display text-[11px] uppercase tracking-wide border border-ink/15 text-ink/50 hover:border-ink/40'
              }
            >
              {type}
            </button>
          ))}
        </div>
      )}

      {/* Price range */}
      <div className="flex items-center gap-3">
        <span className="font-display text-xs uppercase tracking-wide text-ink/50">
          Price
        </span>
        <input
          type="number"
          placeholder="Min"
          value={filters.minPrice || ''}
          onChange={(e) => onChange({ ...filters, minPrice: e.target.value })}
          className="w-24 px-3 py-2 border border-ink/20 rounded-sm focus:outline-none focus:border-indigo bg-transparent text-sm"
        />
        <span className="text-ink/30">—</span>
        <input
          type="number"
          placeholder="Max"
          value={filters.maxPrice || ''}
          onChange={(e) => onChange({ ...filters, maxPrice: e.target.value })}
          className="w-24 px-3 py-2 border border-ink/20 rounded-sm focus:outline-none focus:border-indigo bg-transparent text-sm"
        />
        {(filters.category || filters.search || filters.minPrice || filters.maxPrice || filters.productType) && (
          <button
            onClick={() => onChange({ category: '', search: '', minPrice: '', maxPrice: '', productType: '', sort: filters.sort })}
            className="font-display text-xs uppercase tracking-wide text-madder hover:underline ml-2"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}

export default FilterBar;
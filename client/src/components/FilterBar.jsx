import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
  { label: 'All', value: '' },
  { label: 'Men', value: 'Men' },
  { label: 'Women', value: 'Women' },
  { label: 'Kids', value: 'Kids' },
  { label: 'Unisex', value: 'Unisex' },
];

function FilterBar({ filters, onChange }) {
  const [showPriceFilter, setShowPriceFilter] = useState(false);

  const handleCategoryChange = (val) => {
    onChange({ ...filters, category: val });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...filters, [name]: value });
  };

  const clearPriceFilters = () => {
    onChange({ ...filters, minPrice: '', maxPrice: '' });
    setShowPriceFilter(false);
  };

  const hasActivePrice = filters.minPrice || filters.maxPrice;

  return (
    <div className="bg-bone border-y border-ink/10 py-5 my-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Row 1 / Left: Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {CATEGORIES.map((cat) => {
            const isActive = filters.category === cat.value;
            return (
              <button
                key={cat.label}
                onClick={() => handleCategoryChange(cat.value)}
                className={`px-4 py-2 rounded-sm text-xs font-display uppercase tracking-wider transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink ${
                  isActive
                    ? 'bg-ink text-bone font-semibold shadow-sm'
                    : 'bg-transparent text-ink/70 hover:bg-ink/5 hover:text-ink'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Row 1 / Right: Search, Price Toggle, and Sort */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-56">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              name="search"
              placeholder="Search pieces..."
              value={filters.search || ''}
              onChange={handleInputChange}
              className="w-full pl-8 pr-3 py-2 bg-bone/50 border border-ink/15 rounded-sm text-xs font-display text-ink placeholder:text-ink/40 focus:outline-none focus:border-ink transition-colors"
            />
            {filters.search && (
              <button 
                onClick={() => onChange({ ...filters, search: '' })}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink text-xs font-bold"
              >
                ×
              </button>
            )}
          </div>

          {/* Price Toggle Button */}
          <button
            onClick={() => setShowPriceFilter(!showPriceFilter)}
            className={`px-3 py-2 border rounded-sm text-xs font-display uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
              hasActivePrice || showPriceFilter
                ? 'bg-ink/10 border-ink text-ink font-semibold'
                : 'bg-transparent border-ink/15 text-ink/70 hover:border-ink/40'
            }`}
          >
            <span>Price</span>
            {hasActivePrice && <span className="w-1.5 h-1.5 rounded-full bg-madder"></span>}
          </button>

          {/* Sort Dropdown */}
          <select
            name="sort"
            value={filters.sort || 'newest'}
            onChange={handleInputChange}
            className="px-3 py-2 bg-transparent border border-ink/15 rounded-sm text-xs font-display uppercase tracking-wider text-ink/80 focus:outline-none focus:border-ink cursor-pointer"
          >
            <option value="newest" className="bg-bone text-ink">Newest First</option>
            <option value="price-low" className="bg-bone text-ink">Price: Low to High</option>
            <option value="price-high" className="bg-bone text-ink">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Row 2 (Expandable): Min / Max Price Sliders */}
      <AnimatePresence>
        {showPriceFilter && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden border-t border-ink/10 pt-4 flex flex-wrap items-center justify-end gap-3 text-xs font-display"
          >
            <span className="text-ink/60 uppercase tracking-wider">Range (₹):</span>
            <input
              type="number"
              name="minPrice"
              placeholder="Min"
              value={filters.minPrice || ''}
              onChange={handleInputChange}
              className="w-24 px-3 py-1.5 bg-bone/50 border border-ink/15 rounded-sm focus:outline-none focus:border-ink text-ink"
            />
            <span className="text-ink/40">—</span>
            <input
              type="number"
              name="maxPrice"
              placeholder="Max"
              value={filters.maxPrice || ''}
              onChange={handleInputChange}
              className="w-24 px-3 py-1.5 bg-bone/50 border border-ink/15 rounded-sm focus:outline-none focus:border-ink text-ink"
            />
            {hasActivePrice && (
              <button
                onClick={clearPriceFilters}
                className="text-[11px] text-madder hover:underline ml-2 uppercase tracking-wider font-semibold"
              >
                Reset Price
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FilterBar;
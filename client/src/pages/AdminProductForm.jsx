import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../api/axios';
import TagInput from '../components/TagInput';
import ImageUrlInput from '../components/ImageUrlInput';

const TYPE_OPTIONS = {
  Men: ['T-Shirt', 'Shirt', 'Jeans', 'Trousers', 'Hoodie', 'Jacket', 'Kurta', 'Shorts'],
  Women: ['Dress', 'Top', 'Kurti', 'Saree', 'Jeans', 'Trousers', 'Jacket', 'Skirt'],
  Kids: ['T-Shirt', 'Dress', 'Shorts', 'Set', 'Jacket'],
  Unisex: ['Hoodie', 'T-Shirt', 'Sweatshirt', 'Jacket'],
};

function AdminProductForm() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    description: '',
    mrp: '',
    price: '',
    category: 'Men',
    productType: '',
    sizes: [],
    colors: [],
    images: [],
    stock: '',
    brand: '',
    returnPolicyDays: 7,
  });
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      API.get('/products/' + id)
        .then((res) => {
          const p = res.data;
          setForm({
            name: p.name,
            description: p.description,
            mrp: p.mrp || '',
            price: p.price,
            category: p.category,
            productType: p.productType || '',
            sizes: p.sizes || [],
            colors: p.colors || [],
            images: p.images || [],
            stock: p.stock,
            brand: p.brand,
            returnPolicyDays: p.returnPolicyDays ?? 7, // Handle 0 correctly
          });
        })
        .catch(() => setError('Failed to load product. Please refresh the page.'))
        .finally(() => setFetching(false));
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (cat) => {
    const validTypes = TYPE_OPTIONS[cat] || [];
    const newType = validTypes.includes(form.productType) ? form.productType : '';
    setForm({ ...form, category: cat, productType: newType });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.sizes.length === 0) {
      setError('Please add at least one available size.');
      return;
    }
    if (!form.productType) {
      setError('Please select a specific product type.');
      return;
    }
    if (Number(form.price) > Number(form.mrp)) {
      setError('Selling price cannot be higher than the Original MRP.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: form.name,
        description: form.description,
        mrp: Number(form.mrp),
        price: Number(form.price),
        category: form.category,
        productType: form.productType,
        sizes: form.sizes,
        colors: form.colors,
        images: form.images,
        stock: Number(form.stock),
        brand: form.brand,
        returnPolicyDays: Number(form.returnPolicyDays),
      };

      if (isEditMode) {
        await API.put('/products/' + id, payload);
      } else {
        await API.post('/products', payload);
      }

      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const discountPreview =
    form.mrp && form.price && Number(form.mrp) > Number(form.price)
      ? Math.round(((Number(form.mrp) - Number(form.price)) / Number(form.mrp)) * 100)
      : 0;

  const currentTypeOptions = TYPE_OPTIONS[form.category] || [];

  if (fetching) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-display text-xs uppercase tracking-widest text-ink/50">
          Loading Product Data...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <Link
        to="/admin"
        className="inline-flex items-center font-display text-[11px] uppercase tracking-widest text-ink/50 hover:text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm px-1 -mx-1 mb-8"
      >
        <span className="mr-2">←</span> Back to Dashboard
      </Link>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h1 className="font-body text-3xl sm:text-4xl text-ink mb-2">
              {isEditMode ? 'Edit Product' : 'New Product'}
            </h1>
            <p className="font-display text-[11px] uppercase tracking-widest text-ink/50">
              {isEditMode ? `Updating ID: #${id.slice(-6).toUpperCase()}` : 'Add a new item to the catalog'}
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-madder/5 border border-madder/20 p-4 rounded-sm flex items-start gap-3 mb-8">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-madder mt-0.5 flex-shrink-0">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p className="text-madder text-sm font-display">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-12">
          
          {/* Section 1: Core Details */}
          <section className="bg-bone/30 border border-ink/10 p-6 sm:p-8 rounded-sm">
            <h3 className="font-display text-sm uppercase tracking-widest text-ink/80 mb-6 flex items-center gap-3">
              <span className="w-6 h-[1px] bg-ink/20 block" />
              Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-1.5">
                <label htmlFor="name" className="font-display text-[11px] uppercase tracking-widest text-ink/70 ml-1 block">
                  Product Name <span className="text-madder">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Classic White Heavyweight T-Shirt"
                  className="w-full px-4 py-3.5 border border-ink/15 rounded-sm focus:outline-none focus:border-indigo focus:ring-1 focus:ring-indigo bg-white font-display text-sm text-ink transition-all"
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label htmlFor="description" className="font-display text-[11px] uppercase tracking-widest text-ink/70 ml-1 block">
                  Description <span className="text-madder">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Describe the fabric, fit, feel, and styling recommendations..."
                  className="w-full px-4 py-3.5 border border-ink/15 rounded-sm focus:outline-none focus:border-indigo focus:ring-1 focus:ring-indigo bg-white font-display text-sm text-ink transition-all resize-y"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="brand" className="font-display text-[11px] uppercase tracking-widest text-ink/70 ml-1 block">
                  Brand Label
                </label>
                <input
                  id="brand"
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  placeholder="e.g. Weavind Essentials"
                  className="w-full px-4 py-3.5 border border-ink/15 rounded-sm focus:outline-none focus:border-indigo focus:ring-1 focus:ring-indigo bg-white font-display text-sm text-ink transition-all"
                />
              </div>
            </div>
          </section>

          {/* Section 2: Taxonomy */}
          <section className="bg-bone/30 border border-ink/10 p-6 sm:p-8 rounded-sm">
            <h3 className="font-display text-sm uppercase tracking-widest text-ink/80 mb-6 flex items-center gap-3">
              <span className="w-6 h-[1px] bg-ink/20 block" />
              Taxonomy & Classification
            </h3>
            
            <div className="space-y-8">
              <div>
                <label className="font-display text-[11px] uppercase tracking-widest text-ink/70 ml-1 block mb-3">
                  Primary Category <span className="text-madder">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['Men', 'Women', 'Kids', 'Unisex'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleCategoryChange(cat)}
                      className={`flex flex-col items-center justify-center py-4 px-2 rounded-sm border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo ${
                        form.category === cat
                          ? 'border-indigo bg-indigo/5 shadow-sm'
                          : 'border-ink/15 bg-white hover:border-indigo/40'
                      }`}
                    >
                      <span className={`font-display text-sm tracking-wide ${form.category === cat ? 'text-indigo font-600' : 'text-ink/70'}`}>
                        {cat}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-display text-[11px] uppercase tracking-widest text-ink/70 ml-1 block mb-3">
                  Product Type <span className="text-madder">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {currentTypeOptions.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setForm({ ...form, productType: type })}
                      className={`py-2.5 px-2 rounded-sm font-display text-xs uppercase tracking-wider border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo ${
                        form.productType === type
                          ? 'border-indigo bg-indigo text-white shadow-sm'
                          : 'border-ink/15 bg-white text-ink/60 hover:border-indigo/40 hover:text-ink'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                {!form.productType && (
                  <p className="font-display text-[10px] text-madder/70 mt-3 uppercase tracking-widest ml-1">
                    Please select a product type to continue.
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Section 3: Pricing & Inventory */}
          <section className="bg-bone/30 border border-ink/10 p-6 sm:p-8 rounded-sm">
            <h3 className="font-display text-sm uppercase tracking-widest text-ink/80 mb-6 flex items-center gap-3">
              <span className="w-6 h-[1px] bg-ink/20 block" />
              Pricing, Inventory & Policies
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label htmlFor="mrp" className="font-display text-[11px] uppercase tracking-widest text-ink/70 ml-1 block">
                  Original MRP (₹) <span className="text-madder">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-display text-ink/40">₹</span>
                  <input
                    id="mrp"
                    type="number"
                    name="mrp"
                    value={form.mrp}
                    onChange={handleChange}
                    required
                    min="0"
                    placeholder="2999"
                    className="w-full pl-8 pr-4 py-3.5 border border-ink/15 rounded-sm focus:outline-none focus:border-indigo focus:ring-1 focus:ring-indigo bg-white font-display text-sm text-ink transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="price" className="font-display text-[11px] uppercase tracking-widest text-ink/70 ml-1 block">
                  Selling Price (₹) <span className="text-madder">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-display text-ink/40">₹</span>
                  <input
                    id="price"
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    required
                    min="0"
                    placeholder="1999"
                    className="w-full pl-8 pr-4 py-3.5 border border-ink/15 rounded-sm focus:outline-none focus:border-indigo focus:ring-1 focus:ring-indigo bg-white font-display text-sm text-ink transition-all"
                  />
                </div>
              </div>

              {discountPreview > 0 && (
                <div className="md:col-span-2 bg-indigo/5 border border-indigo/20 rounded-sm p-4 flex items-center gap-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line>
                  </svg>
                  <p className="font-display text-sm text-ink">
                    This setup yields a <span className="text-indigo font-600">{discountPreview}% discount</span>. Customers will see <span className="line-through text-ink/50 mx-1">₹{form.mrp}</span> ₹{form.price}.
                  </p>
                </div>
              )}

              <div className="space-y-1.5">
                <label htmlFor="stock" className="font-display text-[11px] uppercase tracking-widest text-ink/70 ml-1 block">
                  Stock Quantity <span className="text-madder">*</span>
                </label>
                <input
                  id="stock"
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="e.g. 50"
                  className="w-full px-4 py-3.5 border border-ink/15 rounded-sm focus:outline-none focus:border-indigo focus:ring-1 focus:ring-indigo bg-white font-display text-sm text-ink transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="returnPolicyDays" className="font-display text-[11px] uppercase tracking-widest text-ink/70 ml-1 block flex items-center justify-between">
                  <span>Return Window (Days)</span>
                  <span className="text-ink/40 lowercase tracking-normal">0 = Final Sale</span>
                </label>
                <input
                  id="returnPolicyDays"
                  type="number"
                  name="returnPolicyDays"
                  value={form.returnPolicyDays}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3.5 border border-ink/15 rounded-sm focus:outline-none focus:border-indigo focus:ring-1 focus:ring-indigo bg-white font-display text-sm text-ink transition-all"
                />
              </div>
            </div>
          </section>

          {/* Section 4: Variants & Media (Delegated to external components) */}
          <section className="bg-bone/30 border border-ink/10 p-6 sm:p-8 rounded-sm">
            <h3 className="font-display text-sm uppercase tracking-widest text-ink/80 mb-6 flex items-center gap-3">
              <span className="w-6 h-[1px] bg-ink/20 block" />
              Variants & Media
            </h3>
            
            <div className="space-y-8">
              <div className="space-y-1.5">
                <label className="font-display text-[11px] uppercase tracking-widest text-ink/70 ml-1 block">
                  Available Sizes <span className="text-madder">*</span>
                </label>
                <TagInput
                  tags={form.sizes}
                  onChange={(sizes) => setForm({ ...form, sizes })}
                  placeholder="Type size and press Enter (e.g. S, M, L, XL)"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-display text-[11px] uppercase tracking-widest text-ink/70 ml-1 block">
                  Available Colors
                </label>
                <TagInput
                  tags={form.colors}
                  onChange={(colors) => setForm({ ...form, colors })}
                  placeholder="Type color and press Enter (e.g. Vintage Black)"
                />
              </div>

              <div className="space-y-1.5 pt-4 border-t border-ink/5">
                <label className="font-display text-[11px] uppercase tracking-widest text-ink/70 ml-1 block">
                  Product Images
                </label>
                <ImageUrlInput
                  images={form.images}
                  onChange={(images) => setForm({ ...form, images })}
                />
              </div>
            </div>
          </section>

          {/* Sticky Submission Footer */}
          <div className="sticky bottom-4 z-40 bg-bone/95 backdrop-blur-md border border-ink/10 p-4 sm:p-6 rounded-sm shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 mt-12">
            <div className="text-center sm:text-left">
              <p className="font-body text-lg text-ink">Ready to publish?</p>
              <p className="font-display text-[10px] uppercase tracking-widest text-ink/50 mt-0.5">
                Verify all fields before saving
              </p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-10 py-4.5 bg-ink text-bone font-display uppercase tracking-widest text-xs rounded-sm hover:bg-indigo transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-bone border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  {isEditMode ? 'Update Product' : 'Publish Product'}
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default AdminProductForm;
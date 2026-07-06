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
            returnPolicyDays: p.returnPolicyDays || 7,
          });
        })
        .catch(() => setError('Failed to load product'))
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
      setError('Please add at least one size');
      return;
    }

    if (!form.productType) {
      setError('Please select a product type');
      return;
    }

    if (Number(form.price) > Number(form.mrp)) {
      setError('Selling price cannot be higher than MRP');
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
      setError(err.response?.data?.message || 'Failed to save product');
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
      <p className="font-display text-center py-20 text-ink/50">
        Loading product...
      </p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <Link
        to="/admin"
        className="font-display text-xs uppercase tracking-wide text-ink/50 hover:text-indigo transition-colors"
      >
        ← Back to Dashboard
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6"
      >
        <h1 className="font-body text-2xl sm:text-3xl text-ink mb-2">
          {isEditMode ? 'Edit Product' : 'Add New Product'}
        </h1>
        <p className="font-display text-sm text-ink/50 mb-8 sm:mb-10">
          {isEditMode ? 'Update product details' : 'Add a new item to the Weavind collection'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-10">
          {/* Basic Info */}
          <section>
            <h3 className="font-display uppercase tracking-wide text-xs text-madder mb-4 pb-2 border-b border-ink/10">
              Basic Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="font-display text-xs uppercase tracking-wide text-ink/50 block mb-2">
                  Product Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Classic White T-Shirt"
                  className="w-full px-4 py-3 border border-ink/20 rounded-sm focus:outline-none focus:border-indigo bg-transparent"
                />
              </div>

              <div>
                <label className="font-display text-xs uppercase tracking-wide text-ink/50 block mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder="Describe the fabric, fit, and feel of the product"
                  className="w-full px-4 py-3 border border-ink/20 rounded-sm focus:outline-none focus:border-indigo bg-transparent"
                />
              </div>

              <div>
                <label className="font-display text-xs uppercase tracking-wide text-ink/50 block mb-2">
                  Brand
                </label>
                <input
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  placeholder="e.g. Weavind"
                  className="w-full px-4 py-3 border border-ink/20 rounded-sm focus:outline-none focus:border-indigo bg-transparent"
                />
              </div>
            </div>
          </section>

          {/* Pricing & Inventory */}
          <section>
            <h3 className="font-display uppercase tracking-wide text-xs text-madder mb-4 pb-2 border-b border-ink/10">
              Pricing & Inventory
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="w-full sm:w-1/2">
                <label className="font-display text-xs uppercase tracking-wide text-ink/50 block mb-2">
                  MRP / Original Price (Rs.)
                </label>
                <input
                  type="number"
                  name="mrp"
                  value={form.mrp}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="e.g. 1999"
                  className="w-full px-4 py-3 border border-ink/20 rounded-sm focus:outline-none focus:border-indigo bg-transparent"
                />
              </div>
              <div className="w-full sm:w-1/2">
                <label className="font-display text-xs uppercase tracking-wide text-ink/50 block mb-2">
                  Selling Price (Rs.)
                </label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="e.g. 1299"
                  className="w-full px-4 py-3 border border-ink/20 rounded-sm focus:outline-none focus:border-indigo bg-transparent"
                />
              </div>
            </div>

            {discountPreview > 0 && (
              <div className="bg-gold/10 border border-gold/30 rounded-sm px-4 py-2.5 mb-4">
                <p className="font-display text-sm text-ink">
                  <span className="text-madder font-semibold">{discountPreview}% OFF</span>
                  {' '}— Customers will see Rs.{form.mrp} struck through, selling at Rs.{form.price}
                </p>
              </div>
            )}

            <div>
              <label className="font-display text-xs uppercase tracking-wide text-ink/50 block mb-2">
                Stock Quantity
              </label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-4 py-3 border border-ink/20 rounded-sm focus:outline-none focus:border-indigo bg-transparent"
              />
            </div>
          </section>

          {/* Category */}
          <section>
            <h3 className="font-display uppercase tracking-wide text-xs text-madder mb-4 pb-2 border-b border-ink/10">
              Category
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {['Men', 'Women', 'Kids', 'Unisex'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryChange(cat)}
                  className={
                    form.category === cat
                      ? 'py-3 rounded-sm font-display text-sm border-2 border-indigo bg-indigo/10 text-indigo'
                      : 'py-3 rounded-sm font-display text-sm border border-ink/20 text-ink/60 hover:border-indigo/50'
                  }
                >
                  {cat}
                </button>
              ))}
            </div>
          </section>

          {/* Product Type */}
          <section>
            <h3 className="font-display uppercase tracking-wide text-xs text-madder mb-4 pb-2 border-b border-ink/10">
              Product Type
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {currentTypeOptions.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setForm({ ...form, productType: type })}
                  className={
                    form.productType === type
                      ? 'py-2.5 rounded-sm font-display text-sm border-2 border-indigo bg-indigo/10 text-indigo'
                      : 'py-2.5 rounded-sm font-display text-sm border border-ink/20 text-ink/60 hover:border-indigo/50'
                  }
                >
                  {type}
                </button>
              ))}
            </div>
            <p className="font-display text-xs text-ink/40 mt-3">
              Type options change based on the selected category above.
            </p>
          </section>

          {/* Sizes */}
          <section>
            <h3 className="font-display uppercase tracking-wide text-xs text-madder mb-4 pb-2 border-b border-ink/10">
              Available Sizes
            </h3>
            <TagInput
              tags={form.sizes}
              onChange={(sizes) => setForm({ ...form, sizes })}
              placeholder="Type a size and press Enter (e.g. S, M, L, XL)"
            />
          </section>

          {/* Colors */}
          <section>
            <h3 className="font-display uppercase tracking-wide text-xs text-madder mb-4 pb-2 border-b border-ink/10">
              Available Colors
            </h3>
            <TagInput
              tags={form.colors}
              onChange={(colors) => setForm({ ...form, colors })}
              placeholder="Type a color and press Enter (e.g. Black, White)"
            />
          </section>

          {/* Images */}
          <section>
            <h3 className="font-display uppercase tracking-wide text-xs text-madder mb-4 pb-2 border-b border-ink/10">
              Product Images
            </h3>
            <ImageUrlInput
              images={form.images}
              onChange={(images) => setForm({ ...form, images })}
            />
          </section>

          {/* Return Policy */}
          <section>
            <h3 className="font-display uppercase tracking-wide text-xs text-madder mb-4 pb-2 border-b border-ink/10">
              Return Policy
            </h3>
            <div>
              <label className="font-display text-xs uppercase tracking-wide text-ink/50 block mb-2">
                Return Window (Days)
              </label>
              <input
                type="number"
                name="returnPolicyDays"
                value={form.returnPolicyDays}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-3 border border-ink/20 rounded-sm focus:outline-none focus:border-indigo bg-transparent"
              />
              <p className="font-display text-xs text-ink/40 mt-2">
                Standard Weavind policy is 7 days. Set to 0 for non-returnable items.
              </p>
            </div>
          </section>

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
            {loading ? 'Saving...' : isEditMode ? 'Update Product' : 'Add Product'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

export default AdminProductForm;
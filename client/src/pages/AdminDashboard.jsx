import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../api/axios';

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState('products');
  const [loading, setLoading] = useState(true);
  
  // Elegant inline UI states
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
  };

  const fetchData = async () => {
    try {
      const productsRes = await API.get('/products');
      const ordersRes = await API.get('/orders');
      setProducts(productsRes.data);
      setOrders(ordersRes.data);
    } catch (err) {
      showNotification('Failed to load dashboard data. Refresh the page.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleConfirmDelete = async (id) => {
    setIsDeleting(true);
    try {
      await API.delete(`/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
      showNotification('Product deleted successfully.');
    } catch (err) {
      showNotification('Failed to delete product.', 'error');
    } finally {
      setIsDeleting(false);
      setDeleteConfirmId(null);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders(
        orders.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
      showNotification(`Order status updated to ${newStatus}.`);
    } catch (err) {
      showNotification('Failed to update order status.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-display text-xs uppercase tracking-widest text-ink/50">
          Loading Data...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 relative">
      
      {/* Global Inline Notification */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-sm shadow-md flex items-center gap-3 font-display text-xs uppercase tracking-widest border ${
              notification.type === 'error' ? 'bg-madder text-white border-madder/50' : 'bg-ink text-bone border-ink/50'
            }`}
          >
            {notification.type === 'error' ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            )}
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="font-body text-3xl sm:text-4xl text-ink mb-2">Command Center</h1>
          <p className="font-display text-[11px] uppercase tracking-widest text-ink/50">
            Manage Weavind's operations and inventory
          </p>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex gap-2 bg-bone/50 p-1.5 rounded-sm border border-ink/10 w-fit">
          <button
            onClick={() => setTab('products')}
            className={`px-6 py-2.5 font-display text-[10px] uppercase tracking-widest rounded-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo ${
              tab === 'products' ? 'bg-ink text-bone shadow-sm' : 'text-ink/60 hover:text-ink hover:bg-bone'
            }`}
          >
            Products ({products.length})
          </button>
          <button
            onClick={() => setTab('orders')}
            className={`px-6 py-2.5 font-display text-[10px] uppercase tracking-widest rounded-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo ${
              tab === 'orders' ? 'bg-ink text-bone shadow-sm' : 'text-ink/60 hover:text-ink hover:bg-bone'
            }`}
          >
            Orders ({orders.length})
          </button>
        </div>
      </div>

      {/* PRODUCTS TAB */}
      {tab === 'products' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div className="flex justify-end mb-6">
            <Link
              to="/admin/products/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo text-white font-display uppercase tracking-widest text-[10px] rounded-sm hover:bg-indigo/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold shadow-sm"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Product
            </Link>
          </div>
          
          <div className="bg-bone/20 border border-ink/10 rounded-sm overflow-hidden">
            <div className="hidden sm:grid grid-cols-12 gap-4 p-4 border-b border-ink/10 bg-ink/5 font-display text-[10px] uppercase tracking-widest text-ink/60">
              <div className="col-span-5">Product Details</div>
              <div className="col-span-2 text-right">Price</div>
              <div className="col-span-2 text-right">Stock</div>
              <div className="col-span-3 text-right">Actions</div>
            </div>
            
            <div className="divide-y divide-ink/5">
              {products.map((product) => (
                <div key={product._id} className="grid sm:grid-cols-12 gap-4 p-4 items-center hover:bg-bone/40 transition-colors">
                  <div className="sm:col-span-5 min-w-0 flex items-center gap-3">
                    {/* Tiny thumbnail logic can go here if needed later */}
                    <div>
                      <p className="font-body text-base text-ink line-clamp-1">{product.name}</p>
                      <p className="font-display text-[10px] uppercase tracking-widest text-ink/40 mt-0.5">
                        {product.category}
                      </p>
                    </div>
                  </div>
                  <div className="sm:col-span-2 font-display text-sm text-ink sm:text-right hidden sm:block">
                    ₹{product.price}
                  </div>
                  <div className="sm:col-span-2 sm:text-right hidden sm:block">
                    <span className={`font-display text-[10px] uppercase tracking-widest px-2 py-1 rounded-sm border ${product.stock > 10 ? 'text-indigo bg-indigo/5 border-indigo/10' : 'text-madder bg-madder/5 border-madder/10'}`}>
                      {product.stock} Left
                    </span>
                  </div>
                  
                  {/* Actions & Inline Delete Confirmation */}
                  <div className="sm:col-span-3 flex items-center sm:justify-end gap-2 mt-3 sm:mt-0">
                    <AnimatePresence mode="wait">
                      {deleteConfirmId === product._id ? (
                        <motion.div
                          key="confirm"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="flex items-center gap-2 bg-madder/5 p-1 rounded-sm border border-madder/10"
                        >
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            disabled={isDeleting}
                            className="font-display text-[10px] uppercase tracking-widest text-ink/60 hover:text-ink px-2 py-1.5 rounded-sm transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleConfirmDelete(product._id)}
                            disabled={isDeleting}
                            className="font-display text-[10px] uppercase tracking-widest bg-madder text-white px-3 py-1.5 rounded-sm hover:bg-madder/90 disabled:opacity-50 transition-colors"
                          >
                            {isDeleting ? '...' : 'Confirm Delete'}
                          </button>
                        </motion.div>
                      ) : (
                        <motion.div key="actions" className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                          <div className="flex gap-4 sm:hidden font-display text-xs text-ink/60">
                            <span>₹{product.price}</span>
                            <span>•</span>
                            <span>{product.stock} left</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Link
                              to={`/admin/products/edit/${product._id}`}
                              className="font-display text-[11px] uppercase tracking-widest text-indigo hover:text-ink transition-colors px-2 py-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo rounded-sm"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => setDeleteConfirmId(product._id)}
                              className="font-display text-[11px] uppercase tracking-widest text-madder/70 hover:text-madder transition-colors px-2 py-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-madder rounded-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* ORDERS TAB */}
      {tab === 'orders' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-bone/30 border border-ink/10 rounded-sm p-5 sm:p-6 shadow-sm hover:border-indigo/30 transition-colors">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div className="min-w-0 space-y-1.5">
                  <div className="flex items-center gap-3">
                    <p className="font-body text-lg text-ink truncate">
                      {order.user ? order.user.name : 'Guest User'}
                    </p>
                    <span className="font-display text-[10px] uppercase tracking-widest bg-ink/5 border border-ink/10 px-2 py-0.5 rounded-sm text-ink/60">
                      #{order._id.slice(-6).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-display text-xs text-ink/50">
                    <span>{order.items.length} {order.items.length === 1 ? 'Item' : 'Items'}</span>
                    <span>•</span>
                    <span>₹{order.totalAmount}</span>
                    <span>•</span>
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="font-display text-[10px] uppercase tracking-widest text-ink/40 mt-1">
                    Method: {order.paymentMethod} <span className="mx-1">|</span> Status: {order.paymentStatus}
                  </p>
                </div>
                
                {/* Elegant Select Dropdown */}
                <div className="flex items-center gap-3">
                  <label htmlFor={`status-${order._id}`} className="font-display text-[10px] uppercase tracking-widest text-ink/50 hidden sm:block">
                    Fulfillment
                  </label>
                  <div className="relative">
                    <select
                      id={`status-${order._id}`}
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="appearance-none font-display text-xs uppercase tracking-wider border border-ink/20 rounded-sm pl-3 pr-8 py-2 bg-bone text-ink focus:outline-none focus:border-indigo focus:ring-1 focus:ring-indigo transition-all cursor-pointer w-full sm:w-auto"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-ink/50">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

export default AdminDashboard;
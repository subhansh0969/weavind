import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../api/axios';

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState('products');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const productsRes = await API.get('/products');
      const ordersRes = await API.get('/orders');
      setProducts(productsRes.data);
      setOrders(ordersRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteProduct = async (id) => {
    const confirmed = window.confirm('Delete this product?');
    if (!confirmed) return;
    try {
      await API.delete('/products/' + id);
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      window.alert('Failed to delete product');
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await API.put('/orders/' + orderId + '/status', { status: newStatus });
      setOrders(
        orders.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      window.alert('Failed to update status');
    }
  };

  if (loading) {
    return (
      <p className="font-display text-center py-20 text-ink/50">
        Loading admin panel...
      </p>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <h1 className="font-body text-2xl sm:text-3xl text-ink mb-2">Admin Dashboard</h1>
      <p className="font-display text-sm text-ink/50 mb-8">
        Manage Weavind's products and orders
      </p>

      <div className="flex gap-6 border-b border-ink/10 mb-8 overflow-x-auto">
        <button
          onClick={() => setTab('products')}
          className={
            tab === 'products'
              ? 'pb-3 font-display text-sm uppercase tracking-wide text-indigo border-b-2 border-indigo whitespace-nowrap'
              : 'pb-3 font-display text-sm uppercase tracking-wide text-ink/50 whitespace-nowrap'
          }
        >
          Products ({products.length})
        </button>
        <button
          onClick={() => setTab('orders')}
          className={
            tab === 'orders'
              ? 'pb-3 font-display text-sm uppercase tracking-wide text-indigo border-b-2 border-indigo whitespace-nowrap'
              : 'pb-3 font-display text-sm uppercase tracking-wide text-ink/50 whitespace-nowrap'
          }
        >
          Orders ({orders.length})
        </button>
      </div>

      {tab === 'products' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="mb-6">
            <Link
              to="/admin/products/new"
              className="inline-block w-full sm:w-auto text-center px-6 py-3 bg-ink text-bone font-display uppercase tracking-wide text-sm rounded-sm hover:bg-indigo transition-colors"
            >
              + Add Product
            </Link>
          </div>
          <div className="space-y-3">
            {products.map((product) => (
              <div
                key={product._id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border border-ink/10 rounded-sm p-4"
              >
                <div className="min-w-0">
                  <p className="font-body text-ink truncate">{product.name}</p>
                  <p className="font-display text-xs text-ink/50">
                    {product.category} - Rs.{product.price} - Stock: {product.stock}
                  </p>
                </div>
                <div className="flex gap-4 flex-shrink-0">
                  <Link
                    to={'/admin/products/edit/' + product._id}
                    className="font-display text-xs uppercase tracking-wide text-indigo hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    className="font-display text-xs uppercase tracking-wide text-madder hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {tab === 'orders' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          {orders.map((order) => (
            <div key={order._id} className="border border-ink/10 rounded-sm p-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                <div className="min-w-0">
                  <p className="font-body text-ink truncate">
                    {order.user ? order.user.name : 'Unknown'} - Rs.{order.totalAmount}
                  </p>
                  <p className="font-display text-xs text-ink/50">
                    {order.items.length} item(s) -{' '}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p className="font-display text-xs text-ink/40 mt-1">
                    Payment: {order.paymentStatus}
                  </p>
                </div>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  className="font-display text-xs border border-ink/20 rounded-sm px-3 py-2 bg-transparent flex-shrink-0"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

export default AdminDashboard;
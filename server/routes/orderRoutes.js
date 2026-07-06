const express = require('express');
const router = express.Router();
const { Resend } = require('resend');
const Order = require('../models/Order');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

const resend = new Resend(process.env.RESEND_API_KEY);

// @route   POST /api/orders
// @desc    Create a new order
router.post('/', protect, async (req, res) => {
  try {
    const { items, shippingAddress, totalAmount, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const order = new Order({
      user: req.user._id,
      items,
      shippingAddress,
      totalAmount,
      paymentMethod: paymentMethod || 'Online',
    });

    if (paymentMethod === 'COD') {
      order.status = 'Confirmed';
      order.paymentStatus = 'Pending';
    }

    const savedOrder = await order.save();

    if (paymentMethod === 'COD') {
      try {
        const trackingUrl = `${process.env.CLIENT_URL}/my-orders`;
        const itemsHtml = savedOrder.items
          .map(
            (item) =>
              `<tr>
                <td style="padding:8px 0;">${item.name} (${item.size}) x ${item.quantity}</td>
                <td style="padding:8px 0; text-align:right;">Rs.${item.price * item.quantity}</td>
              </tr>`
          )
          .join('');

        await resend.emails.send({
          from: 'Weavind <onboarding@resend.dev>',
          to: req.user.email,
          subject: 'Your Weavind order is confirmed! (Cash on Delivery)',
          html: `
            <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
              <h2 style="color: #1B2A4A;">Thank you for your order, ${savedOrder.shippingAddress.fullName}!</h2>
              <p>Your order <strong>#${savedOrder._id.toString().slice(-8).toUpperCase()}</strong> has been confirmed and will be paid via Cash on Delivery.</p>
              <table style="width:100%; border-collapse: collapse; margin: 20px 0;">
                ${itemsHtml}
              </table>
              <p style="font-weight:bold;">Amount to Pay on Delivery: Rs.${savedOrder.totalAmount}</p>
              <p>Shipping to: ${savedOrder.shippingAddress.addressLine}, ${savedOrder.shippingAddress.city}, ${savedOrder.shippingAddress.state} - ${savedOrder.shippingAddress.pincode}</p>
              <a href="${trackingUrl}" style="display: inline-block; background: #1B2A4A; color: white; padding: 12px 28px; text-decoration: none; border-radius: 4px; margin: 16px 0;">
                Track Your Order
              </a>
              <p style="color: #777; font-size: 13px;">Thank you for shopping with Weavind — Made in India, Made for the World.</p>
            </div>
          `,
        });
      } catch (emailError) {
        console.log('COD order confirmation email failed:', emailError.message);
      }
    }

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   GET /api/orders
// @desc    Get ALL orders (admin only)
router.get('/', protect, admin, async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/orders/myorders
// @desc    Get logged-in user's orders
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const isOwner = order.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/orders/:id/cancel
// @desc    Customer cancels their own order (only if not yet shipped)
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const isOwner = order.user.toString() === req.user._id.toString();
    if (!isOwner) {
      return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }

    if (['Shipped', 'Delivered', 'Cancelled'].includes(order.status)) {
      return res.status(400).json({
        message: `Order cannot be cancelled once it is ${order.status.toLowerCase()}`,
      });
    }

    order.status = 'Cancelled';
    await order.save();

    try {
      await resend.emails.send({
        from: 'Weavind <onboarding@resend.dev>',
        to: process.env.ADMIN_EMAIL,
        subject: 'Order Cancelled — #' + order._id.toString().slice(-8).toUpperCase(),
        html: `
          <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
            <h2 style="color: #A8412F;">An order has been cancelled</h2>
            <p><strong>Order ID:</strong> #${order._id.toString().slice(-8).toUpperCase()}</p>
            <p><strong>Customer:</strong> ${order.shippingAddress.fullName} (${req.user.email})</p>
            <p><strong>Amount:</strong> Rs.${order.totalAmount}</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
            <p>The customer cancelled this order themselves before it was shipped.</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.log('Admin cancellation alert email failed:', emailError.message);
    }

    res.json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status (admin only)
router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status;

    if (status === 'Delivered' && order.paymentMethod === 'COD') {
      order.paymentStatus = 'Paid';
    }

    await order.save();
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
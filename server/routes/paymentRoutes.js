const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { Resend } = require('resend');
const { protect } = require('../middleware/authMiddleware');
const Order = require('../models/Order');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const resend = new Resend(process.env.RESEND_API_KEY);

// @route   POST /api/payment/create-order
// @desc    Create a Razorpay order (before payment)
router.post('/create-order', protect, async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);
    res.status(201).json(razorpayOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/payment/verify
// @desc    Verify payment signature, mark order as paid, send confirmation email
router.post('/verify', protect, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.paymentStatus = 'Paid';
    order.status = 'Confirmed';
    await order.save();

    try {
      const trackingUrl = `${process.env.CLIENT_URL}/my-orders`;
      const itemsHtml = order.items
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
        subject: 'Your Weavind order is confirmed!',
        html: `
          <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
            <h2 style="color: #1B2A4A;">Thank you for your order, ${order.shippingAddress.fullName}!</h2>
            <p>Your order <strong>#${order._id.toString().slice(-8).toUpperCase()}</strong> has been confirmed and is being processed.</p>
            <table style="width:100%; border-collapse: collapse; margin: 20px 0;">
              ${itemsHtml}
            </table>
            <p style="font-weight:bold;">Total Paid: Rs.${order.totalAmount}</p>
            <p>Shipping to: ${order.shippingAddress.addressLine}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}</p>
            <a href="${trackingUrl}" style="display: inline-block; background: #1B2A4A; color: white; padding: 12px 28px; text-decoration: none; border-radius: 4px; margin: 16px 0;">
              Track Your Order
            </a>
            <p style="color: #777; font-size: 13px;">Thank you for shopping with Weavind — Made in India, Made for the World.</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.log('Order confirmation email failed:', emailError.message);
    }

    res.json({ message: 'Payment verified successfully', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
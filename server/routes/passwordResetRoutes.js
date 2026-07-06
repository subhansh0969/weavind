const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/User');
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

// @route   POST /api/password/forgot
// @desc    Generate reset token and email it to the user
router.post('/forgot', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ message: 'If that email exists, a reset link has been sent.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const emailResult = await resend.emails.send({
      from: 'Weavind <onboarding@resend.dev>',
      to: user.email,
      subject: 'Reset your Weavind password',
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #1B2A4A;">Reset your password</h2>
          <p>You requested to reset your Weavind account password. Click the button below to set a new one:</p>
          <a href="${resetUrl}" style="display: inline-block; background: #1B2A4A; color: white; padding: 12px 28px; text-decoration: none; border-radius: 4px; margin: 16px 0;">
            Reset Password
          </a>
          <p style="color: #777; font-size: 13px;">This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });

    console.log('Resend response:', JSON.stringify(emailResult));

    res.json({ message: 'If that email exists, a reset link has been sent.' });
  } catch (error) {
    console.log('Resend send error:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/password/reset/:token
// @desc    Reset password using a valid token
router.post('/reset/:token', async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Reset link is invalid or has expired' });
    }

    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ message: 'Password reset successful. You can now log in.' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
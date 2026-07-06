const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  mrp: {
    type: Number,
    required: true,
    min: 0
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['Men', 'Women', 'Kids', 'Unisex']
  },
  productType: {
    type: String,
    required: true,
    trim: true
  },
  sizes: {
    type: [String],
    required: true
  },
  colors: {
    type: [String],
    default: []
  },
  stock: {
    type: Number,
    required: true,
    default: 0
  },
  images: {
    type: [String],
    default: []
  },
  brand: {
    type: String,
    default: 'Generic'
  },
  returnPolicyDays: {
    type: Number,
    default: 7
  },
  ratings: {
    type: Number,
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

productSchema.virtual('discountPercent').get(function () {
  if (!this.mrp || this.mrp <= this.price) return 0;
  return Math.round(((this.mrp - this.price) / this.mrp) * 100);
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
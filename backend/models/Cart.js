const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema(
  {
    // Service/product identifiers on this site are plain slugs (e.g. "resume-cv"),
    // not Mongo ObjectIds, so this must be a String or every add-to-cart call
    // fails with a CastError.
    productId: {
      type: String,
      required: true,
    },
    name: { type: String, required: true },
    image: { type: String },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    variant: { type: String }, // e.g. size/pack/weight, optional
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // one cart document per user
      index: true,
    },
    items: {
      type: [cartItemSchema],
      default: [],
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Keep a virtual for quick total computation (not persisted)
cartSchema.virtual('subtotal').get(function () {
  return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
});

cartSchema.set('toJSON', { virtuals: true });
cartSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Cart', cartSchema);

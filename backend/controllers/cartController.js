const Cart = require('../models/Cart');

// Helper: find or create a cart for the logged-in user
const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
};

// @desc    Get the logged-in user's cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user.id);
    res.status(200).json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch cart', error: err.message });
  }
};

// @desc    Add an item to the cart (or increment quantity if it already exists)
// @route   POST /api/cart/add
// @body    { productId, name, image, price, quantity, variant }
// @access  Private
exports.addItem = async (req, res) => {
  try {
    const { productId, name, image, price, quantity = 1, variant } = req.body;

    if (!productId || !name || price === undefined) {
      return res.status(400).json({ success: false, message: 'productId, name, and price are required' });
    }

    const cart = await getOrCreateCart(req.user.id);

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId && item.variant === variant
    );

    if (existingItem) {
      existingItem.quantity += Number(quantity);
    } else {
      cart.items.push({ productId, name, image, price, quantity, variant });
    }

    cart.updatedAt = Date.now();
    await cart.save();

    res.status(200).json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to add item to cart', error: err.message });
  }
};

// @desc    Update quantity of a specific item in the cart
// @route   PUT /api/cart/update
// @body    { productId, quantity, variant }
// @access  Private
exports.updateItem = async (req, res) => {
  try {
    const { productId, quantity, variant } = req.body;

    if (!productId || quantity === undefined) {
      return res.status(400).json({ success: false, message: 'productId and quantity are required' });
    }

    if (quantity < 1) {
      return res.status(400).json({ success: false, message: 'quantity must be at least 1 (use remove endpoint to delete)' });
    }

    const cart = await getOrCreateCart(req.user.id);
    const item = cart.items.find(
      (i) => i.productId.toString() === productId && i.variant === variant
    );

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    item.quantity = Number(quantity);
    cart.updatedAt = Date.now();
    await cart.save();

    res.status(200).json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update cart item', error: err.message });
  }
};

// @desc    Remove a single item from the cart
// @route   DELETE /api/cart/remove/:productId
// @query   ?variant=optional
// @access  Private
exports.removeItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { variant } = req.query;

    const cart = await getOrCreateCart(req.user.id);
    const beforeCount = cart.items.length;

    cart.items = cart.items.filter(
      (item) => !(item.productId.toString() === productId && item.variant === variant)
    );

    if (cart.items.length === beforeCount) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    cart.updatedAt = Date.now();
    await cart.save();

    res.status(200).json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to remove item from cart', error: err.message });
  }
};

// @desc    Clear the entire cart
// @route   DELETE /api/cart/clear
// @access  Private
exports.clearCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user.id);
    cart.items = [];
    cart.updatedAt = Date.now();
    await cart.save();

    res.status(200).json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to clear cart', error: err.message });
  }
};

// @desc    Sync a cart from the frontend (e.g. localStorage `growdoctor_cart`)
//          into MongoDB. Typically called once on login/signup to migrate
//          a guest cart into the user's persistent cart.
// @route   POST /api/cart/sync
// @body    { items: [{ productId, name, image, price, quantity, variant }] }
// @access  Private
exports.syncCart = async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({ success: false, message: 'items must be an array' });
    }

    const cart = await getOrCreateCart(req.user.id);

    items.forEach((incoming) => {
      if (!incoming.productId || !incoming.name || incoming.price === undefined) return;

      const existing = cart.items.find(
        (item) => item.productId.toString() === incoming.productId && item.variant === incoming.variant
      );

      if (existing) {
        // merge quantities from the local (guest) cart into the server cart
        existing.quantity += Number(incoming.quantity) || 1;
      } else {
        cart.items.push({
          productId: incoming.productId,
          name: incoming.name,
          image: incoming.image,
          price: incoming.price,
          quantity: incoming.quantity || 1,
          variant: incoming.variant,
        });
      }
    });

    cart.updatedAt = Date.now();
    await cart.save();

    res.status(200).json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to sync cart', error: err.message });
  }
};

const crypto = require('crypto');
const razorpay = require('../config/razorpay');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

// @desc    Create a Razorpay order (step 1 of checkout).
//          Frontend calls this, gets back a razorpayOrderId + key,
//          then opens Razorpay Checkout with that order id.
// @route   POST /api/orders/create
// @body    { items, shippingAddress, shippingFee, tax }
//          items: [{ productId, name, image, price, quantity, variant }]
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(503).json({
        success: false,
        message:
          'Payment gateway is not configured yet. Add real RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET values to backend/.env and restart the server.',
      });
    }

    const { items, shippingAddress, shippingFee = 0, tax = 0 } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order must contain at least one item' });
    }
    if (!shippingAddress) {
      return res.status(400).json({ success: false, message: 'shippingAddress is required' });
    }

    const itemsTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalAmount = itemsTotal + Number(shippingFee) + Number(tax);

    if (totalAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Order total must be greater than zero' });
    }

    // Razorpay expects amount in the smallest currency unit (paise for INR)
    const amountInPaise = Math.round(totalAmount * 100);

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `gd_rcpt_${Date.now()}`,
      notes: { userId: req.user.id.toString() },
    });

    const order = await Order.create({
      user: req.user.id,
      items,
      shippingAddress,
      itemsTotal,
      shippingFee,
      tax,
      totalAmount,
      currency: 'INR',
      razorpayOrderId: razorpayOrder.id,
      paymentStatus: 'created',
      orderStatus: 'pending',
    });

    res.status(201).json({
      success: true,
      order: {
        orderId: order._id,
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount, // paise
        currency: razorpayOrder.currency,
      },
      razorpayKeyId: process.env.RAZORPAY_KEY_ID, // needed by frontend Checkout.js
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create order', error: err.message });
  }
};

// @desc    Verify Razorpay payment signature after checkout completes
//          (step 2 of checkout, called from the Razorpay handler on the frontend).
// @route   POST /api/orders/verify
// @body    { razorpay_order_id, razorpay_payment_id, razorpay_signature }
// @access  Private
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Missing Razorpay verification fields' });
    }

    const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Recreate the expected signature: HMAC_SHA256(order_id + "|" + payment_id, key_secret)
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      order.paymentStatus = 'failed';
      await order.save();
      return res.status(400).json({ success: false, message: 'Payment verification failed: invalid signature' });
    }

    order.paymentStatus = 'paid';
    order.orderStatus = 'confirmed';
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;
    order.paidAt = new Date();
    await order.save();

    // Clear the user's persisted cart now that the order succeeded
    await Cart.findOneAndUpdate({ user: req.user.id }, { items: [], updatedAt: Date.now() });

    res.status(200).json({ success: true, message: 'Payment verified successfully', order });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Payment verification error', error: err.message });
  }
};

// @desc    Razorpay webhook (server-to-server) — more reliable fallback to
//          the client-side verify step above, for cases where the browser
//          tab closes before verification completes.
//          Configure this URL in the Razorpay Dashboard > Webhooks, using
//          the "payment.captured" and "payment.failed" events.
// @route   POST /api/orders/webhook
// @access  Public (Razorpay calls this directly, secured via signature check)
exports.razorpayWebhook = async (req, res) => {
  try {
    if (!process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_WEBHOOK_SECRET === 'your_razorpay_webhook_secret') {
      return res.status(503).json({ success: false, message: 'Webhook secret not configured' });
    }

    const webhookSignature = req.headers['x-razorpay-signature'];
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (webhookSignature !== expectedSignature) {
      return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
    }

    const event = req.body.event;
    const paymentEntity = req.body.payload?.payment?.entity;

    if (!paymentEntity) {
      return res.status(200).json({ success: true }); // ack, nothing to process
    }

    const order = await Order.findOne({ razorpayOrderId: paymentEntity.order_id });
    if (order) {
      if (event === 'payment.captured') {
        order.paymentStatus = 'paid';
        order.orderStatus = order.orderStatus === 'pending' ? 'confirmed' : order.orderStatus;
        order.razorpayPaymentId = paymentEntity.id;
        order.paidAt = new Date();
      } else if (event === 'payment.failed') {
        order.paymentStatus = 'failed';
      }
      await order.save();
    }

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Webhook processing error', error: err.message });
  }
};

// @desc    Get all orders for the logged-in user
// @route   GET /api/orders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch orders', error: err.message });
  }
};

// @desc    Get a single order by id (must belong to the logged-in user)
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.status(200).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch order', error: err.message });
  }
};

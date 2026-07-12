const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createOrder,
  verifyPayment,
  razorpayWebhook,
  getMyOrders,
  getOrderById,
} = require('../controllers/orderController');

// Webhook must be public (Razorpay calls it directly) and must NOT use
// express.json() body parsing if you switch to raw-body signature checks.
// Mounted separately in server.js before the JSON body parser if you need
// strict raw-body HMAC verification.
router.post('/webhook', razorpayWebhook);

router.use(protect); // everything below requires authentication

router.post('/create', createOrder);
router.post('/verify', verifyPayment);
router.get('/', getMyOrders);
router.get('/:id', getOrderById);

module.exports = router;

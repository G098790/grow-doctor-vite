const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
  syncCart,
} = require('../controllers/cartController');

router.use(protect); // all cart routes require authentication

router.get('/', getCart);
router.post('/add', addItem);
router.put('/update', updateItem);
router.delete('/remove/:productId', removeItem);
router.delete('/clear', clearCart);
router.post('/sync', syncCart);

module.exports = router;

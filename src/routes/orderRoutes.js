const express = require('express');
const { authenticateUser, isSuperuser } = require('../middleware/authMiddleware');
const OrderController = require('../controllers/OrderController');

const router = express.Router();

// Define order routes

// Get all orders for the authenticated user (users can only access their own orders)
router.get('/', authenticateUser, OrderController.getAllUserOrders);

// Get a single order by ID for the authenticated user (users can only access their own orders)
router.get('/:id', authenticateUser, OrderController.getOrderById);

// Create a new order (accessible by all authenticated users)
router.post('/', authenticateUser, OrderController.createOrder);

// Update an order (only accessible by superusers)
router.put('/:id', authenticateUser, isSuperuser, OrderController.updateOrder);

// Delete an order (only accessible by superusers)
router.delete('/:id', authenticateUser, isSuperuser, OrderController.deleteOrder);

module.exports = router;

const { Order, Painting, User } = require('../models');

const OrderController = {
    // Get all orders for the authenticated user (users can only access their own orders)
    async getAllUserOrders(req, res) {
        try {
            const orders = await Order.findAll({
                where: { userId: req.user.id },  // Ensure users only see their own orders
                include: [User, Painting]
            });
            res.json(orders);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching orders' });
        }
    },

    // Get a single order by ID for the authenticated user (users can only access their own orders)
    async getOrderById(req, res) {
        try {
            const order = await Order.findOne({
                where: { id: req.params.id, userId: req.user.id },  // Ensure users only access their own orders
                include: [User, Painting]
            });
            if (!order) return res.status(404).json({ error: 'Order not found' });
            res.json(order);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching order' });
        }
    },

    // Create a new order (accessible by all authenticated users)
    async createOrder(req, res) {
        try {
            const { paintingId, quantity, totalPrice, status = 'pending' } = req.body;
            const userId = req.user.id;  // Get the user ID from the authenticated user

            const order = await Order.create({ userId, paintingId, quantity, totalPrice, status });
            res.status(201).json({ message: 'Order created successfully', order });
        } catch (error) {
            res.status(500).json({ error: 'Error creating order' });
        }
    },

    // Update an order (only accessible by superusers)
    async updateOrder(req, res) {
        try {
            const { status } = req.body;
            const order = await Order.findByPk(req.params.id);

            if (!order) return res.status(404).json({ error: 'Order not found' });

            await order.update({ status });
            res.json({ message: 'Order updated successfully', order });
        } catch (error) {
            res.status(500).json({ error: 'Error updating order' });
        }
    },

    // Delete an order (only accessible by superusers)
    async deleteOrder(req, res) {
        try {
            const order = await Order.findByPk(req.params.id);
            if (!order) return res.status(404).json({ error: 'Order not found' });

            await order.destroy();
            res.json({ message: 'Order deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Error deleting order' });
        }
    },
};

module.exports = OrderController;

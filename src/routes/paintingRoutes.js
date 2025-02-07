const express = require('express');
const router = express.Router();
const { authenticateUser, isSuperuser } = require('../middleware/authMiddleware');
const PaintingController = require('../controllers/PaintingController');

// Public Routes (accessible by all users)
router.get('/', PaintingController.getAllPaintings); // Get all paintings
router.get('/:id', PaintingController.getPaintingById); // Get a single painting

// Admin Routes (accessible only by superusers)
router.post('/', authenticateUser, isSuperuser, PaintingController.createPainting); // Create a new painting
router.put('/:id', authenticateUser, isSuperuser, PaintingController.updatePainting); // Update a painting
router.delete('/:id', authenticateUser, isSuperuser, PaintingController.deletePainting); // Delete a painting

module.exports = router;

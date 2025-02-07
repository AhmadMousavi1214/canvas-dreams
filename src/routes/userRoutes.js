const express = require("express");
const { authenticateUser, isSuperuser } = require("../middleware/authMiddleware");
const UserController = require("../controllers/UserController");

const router = express.Router();

// User Routes
router.post("/register", UserController.createUser);
router.post("/login", UserController.login);
router.get("/me", authenticateUser, UserController.getProfile);
router.put("/me", authenticateUser, UserController.updateProfile);
router.delete("/me", authenticateUser, UserController.deleteAccount);

// Admin routes (Superuser only)
router.get("/", authenticateUser, isSuperuser, UserController.getAllUsers);

module.exports = router;

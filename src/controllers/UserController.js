const sequelize = require('../../config/database');
const { User } = require('../models');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const UserController = {

    // 🔹 Login
    async login(req, res) {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(401).json({ error: "Invalid email or password" });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: "Invalid email or password" });
            }

            const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.SECRET_KEY, { expiresIn: "1h" });

            res.json({ message: "Login successful", token });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Server error during login" });
        }
    },

    // 🔹 Get authenticated user's profile
    async getProfile(req, res) {
        try {
            const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            res.json(user);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error fetching user profile" });
        }
    },

    // 🔹 Create a new user (registration)
    async createUser(req, res) {
        try {
            const { username, email, password } = req.body;

            if (!username || !email || !password) {
                return res.status(400).json({ error: 'All fields (username, email, password) are required' });
            }
            
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ error: 'Email already exists' });
            }

            const user = await User.create({ username, email, password });

            res.status(201).json({ message: 'User created successfully', user: { id: user.id, username, email } });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error creating user" });
        }
    },

    // 🔹 Update authenticated user's profile
    async updateProfile(req, res) {
        try {
            const { username, email } = req.body;
            const user = await User.findByPk(req.user.id);

            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            await user.update({ username, email });
            res.json({ message: "Profile updated successfully", user: { id: user.id, username, email } });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error updating profile" });
        }
    },

    // 🔹 Delete authenticated user's account
    async deleteAccount(req, res) {
        try {
            const user = await User.findByPk(req.user.id);

            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            await user.destroy();
            const [result] = await sequelize.query('SELECT MAX(id) AS maxId FROM users');
            const maxId = result[0].maxId;
            const nextAutoIncrement = maxId ? maxId + 1 : 1;

            await sequelize.query(`ALTER TABLE users AUTO_INCREMENT = ${nextAutoIncrement}`);

            res.json({ message: "Account deleted successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error deleting account" });
        }
    },

    // 🔹 Get all users (Only for Superusers)
    async getAllUsers(req, res) {
        try {
            const users = await User.findAll({ attributes: { exclude: ['password'] } });
            if (!users.length) {
                return res.status(404).json({ error: "No users found" });
            }
            res.json(users);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error fetching users" });
        }
    },
};

module.exports = UserController;

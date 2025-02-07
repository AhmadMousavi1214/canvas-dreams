const jwt = require("jsonwebtoken");
const { User } = require("../models");

const authenticateUser = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.split(" ")[1]; // Extract token
        if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded; // Add user data to request

        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid or expired token" });
    }
};

const isSuperuser = async (req, res, next) => {
    if (req.user.role !== "superuser") {
        return res.status(403).json({ error: "Forbidden. Superuser access required." });
    }
    next();
};

module.exports = { authenticateUser, isSuperuser };

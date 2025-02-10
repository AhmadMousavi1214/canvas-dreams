const express = require("express");
const next = require("next");
const db = require("./config/database");

require("dotenv").config(); // Load environment variables

const dev = process.env.NODE_ENV !== "production"; // Check if in dev mode
const app = next({ dev, dir: "./src/views" }); // Next.js frontend in 'src/views'
const handle = app.getRequestHandler(); // Handles Next.js requests

const server = express();

// Middleware
server.use(express.json());

// Import API routes
const userRoutes = require("./src/routes/userRoutes");
const orderRoutes = require("./src/routes/orderRoutes");
const paintingRoutes = require("./src/routes/paintingRoutes");

// Use API routes
server.use("/users", userRoutes);
server.use("/orders", orderRoutes);
server.use("/paintings", paintingRoutes);

// Connect to the database
db.authenticate()
  .then(() => console.log("✅ Database connected..."))
  .catch((err) => console.log("❌ Error: " + err));

// Prepare Next.js and start server
app.prepare().then(() => {
  
  // Handle all other requests with Next.js
  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(process.env.PORT, () => console.log(`🚀 Server running on http://localhost:${process.env.PORT}`));
});

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const apiRoutes = require("./routes");
const errorHandler = require("./middleware/errorHandler");

// Connect to MongoDB Atlas
connectDB();

const app = express();

// Middleware
app.use(
  cors({
    origin: "*", // Allow all origins in dev, or specific origin like http://localhost:3000
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Base Route
app.get("/", (req, res) => {
  res.json({
    message: "New Port Said Restaurant API is running 🚀",
    status: "online",
    docs: "/api/health",
  });
});

// API Routes
app.use("/api", apiRoutes);

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
  console.log(`📡 API Health Check available at http://localhost:${PORT}/api/health`);
});

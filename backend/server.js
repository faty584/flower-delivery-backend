const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());  // Allows all origins by default

// ✅ Import routes
const flowerRoutes = require("./routes/flowerRoutes");
const userRoutes = require("./routes/userRoutes");

// ✅ MongoDB Connection Function
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    setTimeout(connectDB, 5000); // Retry after 5 seconds
  }
};

// ✅ Events for better debugging
mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB disconnected! Trying to reconnect...");
  connectDB();
});
mongoose.connection.on("connected", () => {
  console.log("✅ MongoDB connected again!");
});
mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB error:", err.message);
});

// ✅ Connect to MongoDB first
connectDB();

// ✅ Base route
app.get("/", (req, res) => {
  res.send("🌸 Welcome to the Flower Delivery API!");
});

// ✅ Use routes
app.use("/api/flowers", flowerRoutes);
app.use("/api/users", userRoutes);

// ✅ Unknown routes
app.use((req, res) => res.status(404).json({ message: "Route not found 🚫" }));

// ✅ Start server after DB connects
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

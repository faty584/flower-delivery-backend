const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

// Start express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors("http://localhost:3000"));

// Static folder for uploads
// Serve uploaded images
app.use('/uploads', express.static('uploads'));


// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((error) => console.error('❌ Error connecting to MongoDB:', error));

// Base route
app.get('/', (req, res) => {
  res.send('🌸 Welcome to the Flower Delivery API! Use /api/flowers to manage flowers.');
});

// Routes
app.use('/api/flowers', require('./routes/flowerRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found 🚫" });
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

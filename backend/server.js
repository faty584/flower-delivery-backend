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
app.use(cors({
  origin: ['http://localhost:3000', 'https://your-production-domain.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Static folder for uploads
app.use('/uploads', express.static('uploads'));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  })
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

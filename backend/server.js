const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
require('dotenv').config();
// const StripeRouter = require('./routes/Stripe');

const flowersRouter = require('./routes/flowers'); 
const userRouter = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Enable CORS for all origins
app.use(cors({
  origin: '*', // or specify ['http://localhost:3000', 'https://yourfrontenddomain.com']
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Simple request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// ✅ Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ Serve uploaded images statically (for locally stored files)
// app.use('/api/stripe', StripeRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ API Routes
app.use('/api/flowers', flowersRouter);
app.use('/api/users', userRouter);

// ✅ Root route
app.get('/', (req, res) => {
  res.send('🌸 Welcome to the Flower API!');
});

// ✅ 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error('🔥 Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

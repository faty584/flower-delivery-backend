const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const  path = require('path');

dotenv.config();
//starting express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Flower Delivery API 🌸. Try visiting /api/flower to see all flowers.');
});

app.use('/api/flowers', require('./routes/flowerRoutes'));

app.use('/api/users', require('./routes/userRoutes'));




app.use('/uploads', express.static('uploads'));

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
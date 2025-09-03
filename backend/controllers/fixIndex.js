const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/userModel');

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB ✅");

    // Drop duplicate/invalid index on email if it exists
    try {
      await User.collection.dropIndex("Email_1"); // old wrong index
      console.log("Dropped index: Email_1");
    } catch (err) {
      console.log("Index Email_1 not found or already dropped");
    }

    try {
      await User.collection.dropIndex("email_1"); // possible lowercase duplicate
      console.log("Dropped index: email_1");
    } catch (err) {
      console.log("Index email_1 not found or already dropped");
    }

    console.log("Cleanup complete ✅");
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
};

run();

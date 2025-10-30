const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const flowerSchema = new Schema({
    Title: {
        type: String,
        required: true
    },
    Description: {
        type: String,
        required: true
    },
    Price: {
        type: Number,
        required: true
    },
    Image: {
        type: String,
        required: true
    },
    Category: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Flower', flowerSchema);

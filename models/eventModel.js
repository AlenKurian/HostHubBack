const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    nooftickets: {
        type: Number,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    organizerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },
    buyers: [
        {
            email: String,
            status: {
                type: String,
                enum: ["pending", "paid"],
                default: "pending",
            },
        },
    ],


})

module.exports = mongoose.model('events', eventSchema);
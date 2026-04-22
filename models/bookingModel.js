const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    userMail: {
        type: String,
        required: true
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "events",
        required: true
    },
    ticketsBooked: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    bookedAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Bookings",bookingSchema)
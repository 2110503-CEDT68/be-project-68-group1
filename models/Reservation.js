const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
    resDate: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    room: {
        type: mongoose.Schema.ObjectId,
        ref: 'Room',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Reservation', ReservationSchema);
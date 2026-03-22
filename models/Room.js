const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: [50, 'Name can not be more than 50 characters']
    },
    capacity:{
        type: Number,
        required: [true, 'Please add an capacity']
    },
    picture:{
        type: String,
        default: "https://drive.google.com/uc?export=view&id=1zjdthMTg9nYzgwpEkYwcyIPRC8eqC1L"
    },
    address:{
        type: String,
        required: [true, 'Please add an address']
    },
    district:{
        type: String,
        required: [true, 'Please add a district']
    },
    province:{
        type: String,
        required: [true, 'Please add a province']
    },
    postalcode:{
        type: String,
        required: [true, 'Please add a postalcode'],
        maxlength: [5, 'Postal Code can not be more than 5 digits']
    },
    tel: {
        type: String
    },
    openTime: {
        type: String,
        required: true,
        match: /^([01]\d|2[0-3]):([0-5]\d)$/
    },
    closeTime: {
        type: String,
        required: true,
        match: /^([01]\d|2[0-3]):([0-5]\d)$/
    },
    region:{
        type: String,
        required: [true, 'Please add a region']
    },
    
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

RoomSchema.virtual('reservation', {
    ref: 'Reservation',
    localField: '_id',
    foreignField: 'room',
    justOne: false
});

module.exports = mongoose.model('Room',RoomSchema);
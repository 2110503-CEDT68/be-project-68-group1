const Reservation = require('../models/Reservation');
const Room = require('../models/Room');

exports.getReservations = async (req, res, next) => {
    let query;

    console.log(req.user);

    if (req.user.role !== 'admin') {
        query = Reservation.find({ user: req.user.id }).populate({
            path: 'room',
            select: 'name province tel picture'
        }).populate({
            path: 'user',
            select: 'name email tel'
        });;
    } else {
        if (req.params.roomId) {
            console.log(req.params.roomId);

            query = Reservation.find({ room: req.params.roomId }).populate({
                path: 'room',
                select: 'name province tel picture'
            }).populate({
                path: 'user',
                select: 'name email tel'
            });
        }
        else {
            query = Reservation.find().populate({
                path: 'room',
                select: 'name province tel picture'
            }).populate({
                path: 'user',
                select: 'name email tel'
            });
        }
    }

    try {
        const reservations = await query;

        res.status(200).json({
            success: true,
            count: reservations.length,
            data: reservations
        });
    } catch (err) {
        console.log(err.stack);
        return res.status(500).json({
            success: false,
            message: "Cannot find reservation"
        });
    }
}

exports.getReservation = async (req, res, next) => {
    try {
        const reservations = await Reservation.findById(req.params.id).populate({
            path: 'room',
            select: 'name description tel picture'
        }).populate({
            path: 'user',
            select: 'name email tel'
        });;

        if (!reservations) {
            console.log(err.stack);
            return res.status(404).json({
                success: false,
                message: `No Reservation with an id of ${req.params.id}`
            });
        }

        res.status(200).json({
            success: true,
            data: reservations
        });
    } catch (err) {
        console.log(err.stack);
        return res.status(500).json({
            success: false,
            message: "Cannot find reservation"
        });
    }
}

exports.addReservation = async (req, res, next) => {
    try {
        req.body.room = req.params.roomId;

        req.body.user = req.user.id;

        const room = await Room.findById(req.params.roomId);

        if (!room) {
            return res.status(404).json({ success: false, message: `No room with the id of ${req.params.roomId}` });
        }

        const existedReservations = await Reservation.find({ user: req.user.id });

        if (existedReservations.length >= 3 && req.user.role !== 'admin') {
            return res.status(400).json({ success: false, message: `The user with the ID of ${req.params.roomId} has already made 3 Reservations` });
        }

        const reservation = await Reservation.create(req.body);

        res.status(200).json({
            success: true,
            data: reservation
        });
    } catch (err) {
        console.log(err);

        res.status(500).json({
            success: false,
            message: "Cannot create Reservation"
        });
    }
}

exports.updateReservation = async (req, res, next) => {
    try {
        let reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            return res.status(404).json({ success: true, message: `No reservation with the id of ${req.params.id}` });
        }

        if (reservation.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: `User ${req.user.id} is not authorized to update this reservation` });
        }

        reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: reservation
        });
    } catch (err) {
        console.log(err);

        res.status(500).json({
            success: false,
            message: "Cannot update Reservation"
        });
    }
}

exports.deleteReservation = async (req, res, next) => {
    try {
        let reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            return res.status(404).json({ success: true, message: `No reservation with the id of ${req.params.id}` });
        }

        if (reservation.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: `User ${req.user.id} is not authorized to delete this reservation` });
        }

        await reservation.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        console.log(err);

        res.status(500).json({
            success: false,
            message: "Cannot delete Reservation"
        });
    }
}
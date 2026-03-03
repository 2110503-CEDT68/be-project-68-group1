const Reservation = require('../models/Reservation');
const Room = require('../models/Room');

exports.getRooms = async (req, res, next) => {
    let query;

    const reqQuery = {...req.query};

    const removeField = ['select', 'sort','page','limit'];

    removeField.forEach(param=>delete reqQuery[param]);

    let queryStr = JSON.stringify(req.query);

    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      match => `$${match}`
    );

    query = Room.find(JSON.parse(queryStr)).populate(`reservation`);

    if(req.query.select){
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    };

    const page = parseInt(req.query.page,10) || 1;
    const limit = parseInt(req.query.limit,10) || 25;
    const startIndex = (page-1)*limit;
    const endIndex = page*limit;

    try{
        const total = await Room.countDocuments();
        query = query.skip(startIndex).limit(limit);

        const rooms = await query;

        const pagination = {};

        if(endIndex < total){
            pagination.next = {
                page: page + 1,
                limit
            }
        }

        if(startIndex > 0){
            pagination.prev = {
                page: page - 1,
                limit
            }
        }

        res.status(200).json({success: true, count: rooms.length, data: rooms});
    } catch (err) {
        res.status(400).json({success: false, err: err.message});
    }
}

exports.getRoom = async (req, res, next) => {
    try{
        const room = await Room.findById(req.params.id);

        if(!room){
            return res.status(400).json({success: false, err: "No rooms found"});
        }

        res.status(200).json({success: true, data: room});
    } catch (err) {
        res.status(400).json({success: false, err: err.message});
    }
}

exports.createRoom = async (req, res, next) => {
    try{
        const room = await Room.create(req.body);

        res.status(201).json({success: true, data: room});
    } catch (err) {
        res.status(400).json({success: false, err: err.message});
    }
}

exports.updateRoom = async (req, res, next) => {
    try{
        const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators:true
        });

        if(!room){
            return res.status(400).json({success: false, err: `Room id:${req.param.id} not found`});
        }

        res.status(200).json({success: true, data: room});
    } catch (err) {
        res.status(400).json({success: false, err: err.message});
    }
}

exports.deleteRoom = async (req, res, next) => {
    try{
        const room = await Room.findById(req.params.id);
        
        if(!room){
            return res.status(400).json({success: false, err: `Room id:${req.param.id} not found`});
        }

        await Reservation
    .deleteMany({room : req.params.id});
        await Room.deleteOne({_id: req.params.id});

        res.status(200).json({success: true, data: room});
    } catch (err) {
        res.status(400).json({success: false, err: err.message});
    }
}
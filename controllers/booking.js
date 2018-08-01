import Booking from '../models/booking';
import Menu from '../models/menu/menu';
import httpStatus from 'http-status';
import User from "../models/user";


/**
 * Get Menu
 * @returns {Menu}
 */
function get(req, res) {
    return res.json(req.booking);
}

/**
 * Load booking and append to req.
 */
function load(req, res, next, id) {
    Booking.findById(id).populate("menu host rate")
        .then((booking) => {
            req.booking = booking;
            return next();
        })
        .catch(e => next(e));
}

/**
 * Create new Booking
 * @property {string} req.body.guest - The guest of booking.
 * @property {array} req.body.menu - The menu to book.
 * @returns {Menu}
 */
function create(req, res, next) {
    let booking = new Booking(req.body);
    Menu.get(booking.menu)
        .then((menu) => {
            let available = menu.available - 1;
            Menu.update({_id: menu._id},
                {$set: {available}},
                {runValidators: true})
                .exec().then(() =>
                booking.save().then(booking => {
                    res.status(httpStatus.OK).send(booking);
                }).catch(e => next(e))
            );
        });
}

function confirmBooking(req, res, next) {
    const booking = req.body;
    booking.confirmed = true;
    booking.save().then(booking => {
        res.status(200).send(booking);
    }).catch(e => next(e))
}

/**
 * Get Booking
 * @returns {Booking}
 */
function get(req, res) {
    return res.json(req.booking);
}


function findByMenuId(req, res, next) {
    let menuId = req.menu._id;
    Booking.find({menu: menuId}).populate("guest").sort({date: -1}).exec()
        .then(bookings => {
            res.status(httpStatus.OK).send(bookings);
        }).catch(e => next(e));
}

/**
 * Get bookings by hostId or guestId
 * @returns {Booking}
 */
function findByGuestIdOrHostId(req, res, next) {
    let hostId = req.query.hostId;
    let guestId = req.query.guestId;
    let dateFrom = req.query.dateFrom;
    let dateTo = req.query.dateTo;
    let query = {};
    if (dateFrom !== undefined) {
        dateFrom = new Date(dateFrom);
        query.menuDate = {
            $gte: dateFrom
        };
    }
    if (dateTo !== undefined) {
        dateTo = new Date(dateTo);
        query.menuDate = {
            $lte: dateTo
        };
    }
    if (hostId !== undefined && guestId === undefined) {
        query.host = hostId;
    }
    else if (guestId !== undefined && hostId === undefined) {
        query.guest = guestId;
    }
    else if (guestId !== undefined && hostId !== undefined) {
        query.$or = [{host: hostId},
            {guest: guestId}];
    }
    Booking.find(query).populate("menu host rate").sort({date: -1}).exec()
        .then(bookings => {
            res.status(httpStatus.OK).send(bookings);
        }).catch(e => next(e));
}


export default {create, findByGuestIdOrHostId, get, load, confirmBooking, findByMenuId}

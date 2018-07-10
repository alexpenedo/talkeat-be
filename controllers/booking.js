import Booking from '../models/booking';
import Menu from '../models/menu/menu';
import httpStatus from 'http-status';


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
            Menu.update({ _id: menu._id },
                { $set: { available } },
                { runValidators: true })
                .exec().then(() =>
                    booking.save().then(booking => {
                        res.status(httpStatus.OK).send(booking);
                    }).catch(e => next(e))
                );
        });
}


/**
 * Get Booking
 * @returns {Booking}
 */
function get(req, res) {
    return res.json(req.booking);
}

/**
 * Get bookings by hostId or guestId
 * @returns {Booking}
 */
function findByGuestIdOrHostId(req, res, next) {
    let hostId = req.query.hostId;
    let guestId = req.query.guestId;
    let dateFrom = req.query.dateFrom;
    let query = {};
    if (dateFrom !== undefined)
        queru.menuDate = {
            $gte: new Date()
        };
    if (hostId !== undefined && guestId === undefined) {
        query.host = hostId;
    }
    else if (guestId !== undefined && hostId === undefined) {
        query.guest = guestId;
    }
    else if (guestId !== undefined && hostId !== undefined) {
        query.$or = [{ host: hostId },
        { guest: guestId }];
    }
    Booking.find(query).populate("menu host rate").sort({ date: -1 }).exec()
        .then(bookings => {
            res.status(httpStatus.OK).send(bookings);
        }).catch(e => next(e));
}


export default { create, findByGuestIdOrHostId, get, load }

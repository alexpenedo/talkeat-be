import Booking from '../models/booking';
import Menu from '../models/menu/menu';
import httpStatus from 'http-status';
import APIError from '../utils/APIError';
import config from '../config/config';
import assert from 'assert';

/**
 * Load booking and append to req.
 */
function load(req, res, next, id) {
    Booking.get(id)
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
                .exec().then(menu =>
                    booking.save().then(booking => {
                        res.status(200).send(menu)
                    }).catch(e => next(e))
                );
        });
}

export default { create }
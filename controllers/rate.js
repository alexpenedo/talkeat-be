import Rate from '../models/rate';
import Booking from '../models/booking';
import httpStatus from 'http-status';
import APIError from '../utils/APIError';
import config from '../config/config';
import assert from 'assert';
import mongoose from 'mongoose';

/**
 * Create new Rate
 * @property {string} req.body.guest - The guest who rates
 * @property {string} req.body.host - The host to rate
 * @property {number} req.body.rate - The rate number 1-5 
 * @property {string} req.body.comment - The valoration comment
 * @property {array} req.body.booking - The booking to rate.
 * @returns {Menu}
 */
function create(req, res, next) {
    let rate = new Rate(req.body);
    rate.save().then(rate => {
        Booking.findByIdAndUpdate(rate.booking, { rate }).exec();
        res.status(httpStatus.OK).send(rate);
    }).catch(e => next(e));
}

function getAverageByHostId(req, res, next) {
    let hostId = mongoose.Types.ObjectId(req.query.hostId);
    Rate.aggregate({
        $match: { host: hostId }
    }).group({
        _id: '$host',
        average: {
            $avg: '$rate'
        }
    }).then((agg) => {
        res.status(httpStatus.OK).send(agg[0]);
    }).catch(e => next(e));
}

function getRatesByHostId(req, res, next) {
    let hostId = req.query.hostId
    Rate.find({
        host: hostId
    }).populate("guest").sort({ date: -1 })
        .limit(5).then((rates) => {
            console.log(rates);
            res.status(httpStatus.OK).send(rates);
        }).catch(e => next(e));
}

export default { create, getAverageByHostId, getRatesByHostId }
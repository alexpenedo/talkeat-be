import Promise from 'bluebird';
import mongoose, { MongooseDocument, Schema } from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../utils/APIError';

const BookingSchema = new mongoose.Schema({
    date: {
        type: Date,
    },
    guest: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    host: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    menuDate: {
        type: Date,
    },
    menu: {
        type: Schema.Types.ObjectId,
        ref: 'Menu',
        required: true
    },
    confirmed: {
        type: Boolean,
        required: true,
        default: false
    },
    rate: {
        type: Schema.Types.ObjectId,
        ref: 'Rate'
    }
});


BookingSchema.method({
});

BookingSchema.pre('save', function (next) {
    this.date = new Date();
    next();
});

BookingSchema.statics = {
    /**
    * Get Booking
    * @param {ObjectId} id - The objectId of menu.
    * @returns {Promise<Booking, APIError>}
    */
    get(id) {
        return this.findById(id)
            .populate("menu")
            .exec()
            .then((booking) => {
                if (booking) {
                    return booking;
                }
                const err = new APIError('No such booking exists!', httpStatus.NOT_FOUND);
                return Promise.reject(err);
            });
    }

};

/**
 * @typedef Booking
 */
export default mongoose.model('Booking', BookingSchema);
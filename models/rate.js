import Promise from 'bluebird';
import mongoose, { MongooseDocument, Schema } from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../utils/APIError';

const RateSchema = new mongoose.Schema({
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
        required: true
    },
    booking: {
        type: Schema.Types.ObjectId,
        ref: 'Booking',
        required: true
    },
    comment: {
        type: String
    },
    rate: {
        type: Number,
        required: true
    }
});


RateSchema.method({
});

RateSchema.pre('save', function (next) {
    this.date = new Date();
    next();
});

/**
 * @typedef Rate
 */
export default mongoose.model('Rate', RateSchema);
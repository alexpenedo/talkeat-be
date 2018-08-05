import {Schema} from "mongoose";
import {Rate} from "../interfaces/rate.interface";

const RateSchema = new Schema({
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


RateSchema.pre<Rate>('save', function (next) {
    this.date = new Date();
    next();
}).pre<Rate>('findOne', function (next) {
    this.populate('host guest booking');
    next();
});

export default RateSchema;
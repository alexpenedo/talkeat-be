import {Schema} from "mongoose";

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
    },
    type: {
        type: String,
        required: true
    },
});


RateSchema.pre<any>('save', function (next) {
    this.date = new Date();
    next();
}).pre('findOne', function (next) {
    this.populate('host guest booking');
    next();
});

export default RateSchema;
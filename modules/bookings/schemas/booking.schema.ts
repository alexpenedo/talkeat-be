import {Schema} from "mongoose";
import {Booking} from "../interfaces/booking.interface";

const BookingSchema: Schema = new Schema({
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

BookingSchema.pre<Booking>('save', function (next) {
    this.date = new Date();
    next();
}).pre<Booking>('findOne', function (next) {
    this.populate('host guest menu rate');
    next();
}).pre<Booking>('find', function (next) {
    this.populate('host guest menu rate');
    next();
});


export default BookingSchema;
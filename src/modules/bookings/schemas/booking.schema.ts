import {Schema} from "mongoose";

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
    persons: {
        type: Number,
        required: true
    },
    comment: {
        type: String
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
    canceled: {
        type: Boolean,
        required: true,
        default: false
    },
    rate: {
        type: Schema.Types.ObjectId,
        ref: 'Rate'
    }
});

BookingSchema.pre<any>('save', function (next) {
    this.date = new Date();
    next();
}).pre('findOne', function (next) {
    this.populate('host guest menu rate');
    next();
}).pre('find', function (next) {
    this.populate('host guest menu rate');
    next();
});


export default BookingSchema;
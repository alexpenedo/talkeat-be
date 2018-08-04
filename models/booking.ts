import {Schema, Document, Model, model} from 'mongoose';
import {IUser} from "./user";
import {IRate} from "./rate";
import {IMenu} from "./menu/menu";

export interface IBooking extends Document {
    date: Date;
    guest: IUser | string;
    host: IUser | string;
    menuDate: Date;
    menu: IMenu;
    confirmed: boolean;
    rate: IRate | string;
}

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


BookingSchema.pre<IBooking>('save', function (next) {
    this.date = new Date();
    next();
});

export default BookingSchema;
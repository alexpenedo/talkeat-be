import {Document, Model, model, Schema} from 'mongoose';
import {IUser} from "./user";
import {IBooking} from "./booking";

export interface IRate extends Document {
    date: Date;
    guest: IUser;
    host: IUser;
    booking: IBooking | string;
    comment: string;
    rate: number;
}

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


RateSchema.pre<IRate>('save', function (next) {
    this.date = new Date();
    next();
});

export default RateSchema;

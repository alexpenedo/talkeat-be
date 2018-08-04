import {Schema, Document, Model, model} from 'mongoose';
import {IBooking} from "../booking";
import {IUser} from "../user";
import {IMessage, Message} from "./message";

export interface IChat extends Document{
    booking: IBooking | string;
    menuDate: Date;
    host: IUser | string;
    guest: IUser | string;
    messages: IMessage[];
    hostLastConnection: Date;
    guestLastConnection: Date;
    deleted?: boolean;
}

const ChatSchema = new Schema({
    booking: {
        type: Schema.Types.ObjectId,
        ref: 'Booking',
        required: true
    },
    menuDate: {
        type: Date,
        required: true
    },
    host: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    guest: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    messages: [Message],
    hostLastConnection: {
        type: Date,
        required: true
    },
    guestLastConnection: {
        type: Date,
        required: true
    },
    deleted: {
        type: Boolean
    }
});

export default ChatSchema;
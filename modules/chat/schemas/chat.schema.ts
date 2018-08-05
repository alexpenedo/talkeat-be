import {Schema} from "mongoose";
import {Chat} from "../interfaces/chat.interface";
import {Message} from "./message.schema";

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

ChatSchema.pre<Chat>('findOne', function (next) {
    this.populate('host guest booking');
    next();
}).pre<Chat>('find', function (next) {
    this.populate('host guest booking');
    next();
});


export default ChatSchema;
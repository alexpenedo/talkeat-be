import {Schema} from "mongoose";
import {Chat} from "../interfaces/chat.interface";

const ChatSchema = new Schema({
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


ChatSchema.pre<Chat>('save', function (next) {
    this.date = new Date();
    next();
});

export default ChatSchema;
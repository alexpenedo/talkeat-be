import {Document, Schema} from "mongoose";

export const Message = new Schema({
    date: {
        type: Date,
    },
    message: {
        type: String,
        required: true
    },
    from: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});
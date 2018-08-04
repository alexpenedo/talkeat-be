import {Schema} from 'mongoose';
import {IUser} from "../user";

export interface IMessage extends Document {
    date: Date;
    message: string;
    from: IUser;
}

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
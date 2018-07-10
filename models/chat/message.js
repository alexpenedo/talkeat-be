import mongoose, {MongooseDocument, Schema} from 'mongoose';

const Message = new mongoose.Schema({
    date: {
        type: Date,
    },
    message: {
        type: String,
        required: true
    },
    from: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

/**
 * @typedef Message
 */
export default Message;
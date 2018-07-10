import Promise from 'bluebird';
import mongoose, {Schema} from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../../utils/APIError';
import Message from './message';

const ChatSchema = new mongoose.Schema({
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
});


ChatSchema.method({});

ChatSchema.statics = {
    /**
     * Get Message
     * @param {ObjectId} id - The objectId of menu.
     * @returns {Promise<Chat, APIError>}
     */
    get(id) {
        return this.findById(id)
            .exec()
            .then((chat) => {
                if (chat) {
                    return chat;
                }
                const err = new APIError('No such message exists!', httpStatus.NOT_FOUND);
                return Promise.reject(err);
            });
    }

};

/**
 * @typedef Chat
 */
export default mongoose.model('Chat', ChatSchema);
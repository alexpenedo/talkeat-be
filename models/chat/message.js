import Promise from 'bluebird';
import mongoose, { MongooseDocument, Schema } from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../../utils/APIError';

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
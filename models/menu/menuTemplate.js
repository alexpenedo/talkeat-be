import Promise from 'bluebird';
import mongoose, { Schema } from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../../utils/APIError';
import MenuComponent from './menuComponent'

const MenuTemplateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    starters: [MenuComponent],
    mains: [MenuComponent],
    desserts: [MenuComponent],
    guests: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    host: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

MenuTemplateSchema.method({
});


MenuTemplateSchema.statics = {
    /**
    * Get MenuTemplate
    * @param {ObjectId} id - The objectId of menuTemplate.
    * @returns {Promise<User, APIError>}
    */
    get(id) {
        return this.findById(id)
            .exec()
            .then((menuTemplate) => {
                if (menuTemplate) {
                    return menuTemplate;
                }
                const err = new APIError('No such menuTemplate exists!', httpStatus.NOT_FOUND);
                return Promise.reject(err);
            });
    }

};

/**
 * @typedef MenuTemplate
 */
export default mongoose.model('MenuTemplate', MenuTemplateSchema);


import Promise from 'bluebird';
import mongoose, { Schema } from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../../utils/APIError';
import MenuComponent from './menuComponent'

const MenuSchema = new mongoose.Schema({
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
    available: {
        type: Number,
        min: 0
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
    date: {
        type: Date,
        required: true
    },
    postalCode: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

MenuSchema.pre('save', function (next) {
    this.available = this.guests;
    next();
});

MenuSchema.method({
});


MenuSchema.statics = {
    /**
    * Get Menu
    * @param {ObjectId} id - The objectId of menu.
    * @returns {Promise<Menu, APIError>}
    */
    get(id) {
        return this.findById(id)
            .exec()
            .then((menu) => {
                if (menu) {
                    return menu;
                }
                const err = new APIError('No such menu exists!', httpStatus.NOT_FOUND);
                return Promise.reject(err);
            });
    }

};

/**
 * @typedef Menu
 */
export default mongoose.model('Menu', MenuSchema);
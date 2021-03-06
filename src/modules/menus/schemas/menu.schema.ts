import {Schema} from 'mongoose';
import {MenuComponent} from "./menu-component.schema";

const MenuSchema = new Schema({
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
    location: {
        type: [Number],
        index: '2dsphere'
    },
    canceled: {
        type: Boolean,
        required: true,
        default: false
    }
});

MenuSchema.pre<any>('save', function (next) {
    this.available = this.guests;
    next();
}).pre('findOne', function (next) {
    this.populate('host');
    next();
}).pre('find', function (next) {
    this.populate('host');
    next();
});

export default MenuSchema;
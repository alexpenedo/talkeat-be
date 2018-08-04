import {Document, Model, model, Schema} from 'mongoose';
import {IMenuComponent, MenuComponent} from './menuComponent'
import {IUser} from "../user";

export interface IMenu extends Document {
    name: string;
    description: string;
    starters: IMenuComponent[];
    mains: IMenuComponent[];
    desserts: IMenuComponent[];
    guests: number;
    available: number;
    price: number;
    host: IUser | string;
    date: Date;
    postalCode: string;
    address: string;
    country: string;
    createdAt: string;
    location: any;
}

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
    createdAt: {
        type: Date,
        default: Date.now
    },
    location: {
        type: [Number],
        index: '2d'
    }

});

MenuSchema.pre<IMenu>('save', function (next) {
    this.available = this.guests;
    next();
});

export default MenuSchema;
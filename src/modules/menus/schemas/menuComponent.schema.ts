import {Schema} from 'mongoose';

export const MenuComponent= new Schema({
    name: {
        type: String,
        required: true
    }
});
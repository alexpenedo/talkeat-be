import {Schema} from 'mongoose';

export interface IMenuComponent {
    name: string;
}

export const MenuComponent = new Schema({
    name: {
        type: String,
        required: true
    }
});



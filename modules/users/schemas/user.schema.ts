import {Schema} from 'mongoose';

export const UserSchema= new Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Not valid email']
    },
    mobileNumber: {
        type: String,
        required: true,
        match: [/^[1-9][0-9]{8}$/, 'The value of path {PATH} ({VALUE}) is not a valid mobile number.']
    },
    password: {
        type: String,
        required: true
    },
    picture: {
        type: String
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
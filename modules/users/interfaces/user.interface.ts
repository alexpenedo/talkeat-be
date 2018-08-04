import { Document } from 'mongoose';

export interface User extends Document {
    name: string;
    surname: string;
    email: string,
    mobileNumber: string;
    password: string,
    picture?: string,
    postalCode: string,
    address: string,
    country: string,
    createdAt: Date
}

import { Document } from 'mongoose';
import {IUser} from "../../../models/user";
import {IMenuComponent} from "./menuComponent.interface";

export interface Menu extends Document {
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
    location: any[];
}

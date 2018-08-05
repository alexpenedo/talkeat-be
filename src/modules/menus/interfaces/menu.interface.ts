import { Document } from 'mongoose';
import {MenuComponent} from "./menuComponent.interface";
import {User} from "../../users/interfaces/user.interface";

export interface Menu extends Document {
    name: string;
    description: string;
    starters: MenuComponent[];
    mains: MenuComponent[];
    desserts: MenuComponent[];
    guests: number;
    available: number;
    price: number;
    host: User;
    date: Date;
    postalCode: string;
    address: string;
    country: string;
    createdAt: string;
    location: any[];
}

import {Document} from 'mongoose';
import {User} from "../../users/interfaces/user.interface";
import {Booking} from "../../bookings/interfaces/booking.interface";
import {Message} from "./message.interface";

export interface Chat extends Document {
    booking: Booking;
    menuDate: Date;
    host: User;
    guest: User;
    date: Date;
    messages: Message[];
    hostLastConnection: Date;
    guestLastConnection: Date;
    deleted?: boolean;
}
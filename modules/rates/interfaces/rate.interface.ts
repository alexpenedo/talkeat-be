import {Document} from 'mongoose';
import {User} from "../../users/interfaces/user.interface";
import {Booking} from "../../bookings/interfaces/booking.interface";

export interface Rate extends Document {
    date: Date;
    guest: User;
    host: User;
    booking: Booking;
    comment: string;
    rate: number;
}

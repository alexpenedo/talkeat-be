import {Document} from 'mongoose';
import {Menu} from "../../menus/interfaces/menu.interface";
import {User} from "../../users/interfaces/user.interface";
import {Rate} from "../../rates/interfaces/rate.interface";

export interface Booking extends Document {
    date: Date;
    guest: User;
    host: User;
    menuDate: Date;
    menu: Menu;
    confirmed?: boolean;
    rate?: Rate;
}

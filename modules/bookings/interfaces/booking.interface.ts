import {Document} from 'mongoose';
import {IRate} from "../../../models/rate";
import {Menu} from "../../menus/interfaces/menu.interface";
import {User} from "../../users/interfaces/user.interface";

export interface Booking extends Document {
    date: Date;
    guest: User;
    host: User;
    menuDate: Date;
    menu: Menu;
    confirmed: boolean;
    rate: IRate;
}

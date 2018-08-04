import {User} from "../../users/interfaces/user.interface";

export interface Message extends Document {
    date: Date;
    message: string;
    from: User;
}
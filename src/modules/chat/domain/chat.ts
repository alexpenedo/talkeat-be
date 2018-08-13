import {Booking} from "../../bookings/domain/booking";
import {Message} from "./message";
import {User} from "../../users/domain/user";
import {IsArray, IsBoolean, IsDateString, IsInstance, IsOptional} from "class-validator";
import {Entity} from "../../../common/domain/entity";

export class Chat extends Entity{
    @IsInstance(Booking)
    booking: Booking;
    @IsDateString()
    menuDate: Date;
    @IsInstance(User)
    host: User;
    @IsInstance(User)
    guest: User;
    @IsDateString()
    date: Date;
    @IsArray()
    messages: Message[];
    @IsDateString()
    hostLastConnection: Date;
    @IsDateString()
    guestLastConnection: Date;
    @IsBoolean()
    @IsOptional()
    deleted?: boolean;
}
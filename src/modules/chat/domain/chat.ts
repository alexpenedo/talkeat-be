import {Booking} from "../../bookings/domain/booking";
import {Message} from "./message";
import {IsArray, IsBoolean, IsDateString, IsOptional, ValidateNested} from "class-validator";
import {Entity} from "../../../common/domain/entity";

export class Chat extends Entity {
    @ValidateNested()
    booking: Booking;
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
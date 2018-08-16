import {Booking} from "../../bookings/domain/booking";
import {User} from "../../users/domain/user";
import {IsDateString, IsInt, IsOptional, IsString, ValidateNested} from "class-validator";
import {Entity} from "../../../common/domain/entity";

export class Rate extends Entity {
    @IsDateString()
    @IsOptional()
    date: Date;
    @ValidateNested()
    guest: User;
    @ValidateNested()
    host: User;
    @ValidateNested()
    booking: Booking;
    @IsString()
    @IsOptional()
    comment?: string;
    @IsInt()
    rate: number;
    @IsString()
    type: string;
}

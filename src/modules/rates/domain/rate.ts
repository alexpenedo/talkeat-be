import {Booking} from "../../bookings/domain/booking";
import {IsDateString, IsInt, IsOptional, IsString, ValidateNested} from "class-validator";
import {Entity} from "../../../common/domain/entity";

export class Rate extends Entity {
    @IsDateString()
    @IsOptional()
    date: Date;
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

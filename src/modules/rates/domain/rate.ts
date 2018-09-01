import {Booking} from "../../bookings/domain/booking";
import {IsDateString, IsEnum, IsInstance, IsInt, IsOptional, IsString, ValidateNested} from "class-validator";
import {Entity} from "../../../common/domain/entity";
import {RateType} from "../../../common/enums/rate-type.enum";

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
    @IsEnum(RateType)
    type: RateType;
}

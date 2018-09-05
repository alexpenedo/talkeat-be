import {Booking} from "../../bookings/domain/booking";
import {IsDateString, IsEnum, IsInt, IsOptional, IsString, ValidateNested} from "class-validator";
import {Entity} from "../../../common/domain/entity";
import {RateType} from "../../../common/enums/rate-type.enum";
import {ApiModelProperty} from "@nestjs/swagger";

export class Rate extends Entity {
    @ApiModelProperty()
    @IsDateString()
    @IsOptional()
    date: Date;
    @ApiModelProperty()
    @ValidateNested()
    booking: Booking;
    @ApiModelProperty()
    @IsString()
    @IsOptional()
    comment?: string;
    @ApiModelProperty()
    @IsInt()
    rate: number;
    @ApiModelProperty()
    @IsEnum(RateType)
    type: RateType;
}

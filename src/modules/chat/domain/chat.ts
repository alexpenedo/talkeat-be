import {Booking} from "../../bookings/domain/booking";
import {Message} from "./message";
import {IsArray, IsBoolean, IsDateString, IsOptional, ValidateNested} from "class-validator";
import {Entity} from "../../../common/domain/entity";
import {ApiModelProperty} from "@nestjs/swagger";

export class Chat extends Entity {
    @ApiModelProperty()
    @ValidateNested()
    booking: Booking;
    @ApiModelProperty()
    @IsDateString()
    date: Date;
    @ApiModelProperty()
    @IsArray()
    messages: Message[];
    @ApiModelProperty()
    @IsDateString()
    hostLastConnection: Date;
    @ApiModelProperty()
    @IsDateString()
    guestLastConnection: Date;
    @ApiModelProperty()
    @IsBoolean()
    @IsOptional()
    deleted?: boolean;
}
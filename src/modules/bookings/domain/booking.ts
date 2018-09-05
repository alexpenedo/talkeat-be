import {Menu} from "../../menus/domain/menu";
import {User} from "../../users/domain/user";
import {IsBoolean, IsDateString, IsInt, IsOptional, IsString, ValidateNested} from "class-validator";
import {Entity} from "../../../common/domain/entity";
import {ApiModelProperty} from "@nestjs/swagger";

export class Booking extends Entity {
    @ApiModelProperty()
    @IsOptional()
    @IsDateString()
    date?: Date;
    @ApiModelProperty()
    @ValidateNested()
    guest: User;
    @IsInt()
    @ApiModelProperty()
    persons: number;
    @IsString()
    @IsOptional()
    @ApiModelProperty()
    comment: string;
    @ApiModelProperty()
    @ValidateNested()
    menu: Menu;
    @ApiModelProperty()
    @IsBoolean()
    @IsOptional()
    confirmed?: boolean;
    @ApiModelProperty()
    @IsBoolean()
    @IsOptional()
    canceled?: boolean;

}

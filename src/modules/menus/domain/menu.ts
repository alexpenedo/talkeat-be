import {MenuComponent} from "./menu-component";
import {
    IsArray,
    IsBoolean,
    IsDateString,
    IsInt,
    IsNumberString,
    IsOptional,
    IsString,
    ValidateNested
} from "class-validator";
import {User} from "../../users/domain/user";
import {Entity} from "../../../common/domain/entity";
import {ApiModelProperty} from "@nestjs/swagger";

export class Menu extends Entity {
    @ApiModelProperty()
    @IsString()
    name: string;
    @ApiModelProperty()
    @IsString()
    description: string;
    @ApiModelProperty()
    @IsArray()
    starters: MenuComponent[];
    @ApiModelProperty()
    @IsArray()
    mains: MenuComponent[];
    @ApiModelProperty()
    @IsArray()
    desserts: MenuComponent[];
    @ApiModelProperty()
    @IsInt()
    guests: number;
    @ApiModelProperty()
    @IsInt()
    @IsOptional()
    available?: number;
    @ApiModelProperty()
    @IsNumberString()
    price: number;
    @ValidateNested()
    @ApiModelProperty()
    host: User;
    @IsDateString()
    @ApiModelProperty()
    date: Date;
    @IsString()
    @ApiModelProperty()
    postalCode: string;
    @IsString()
    @ApiModelProperty()
    address: string;
    @IsString()
    @ApiModelProperty()
    country: string;
    @IsArray()
    @ApiModelProperty()
    location: number[];
    @ApiModelProperty({required:false})
    @IsBoolean()
    @IsOptional()
    canceled?: boolean;
    average: number;
    distance: number;
}

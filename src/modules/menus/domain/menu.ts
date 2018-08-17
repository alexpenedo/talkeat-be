import {MenuComponent} from "./menu-component";
import {
    IsArray, IsBoolean,
    IsDateString,
    IsDefined,
    IsInt,
    IsNumberString,
    IsOptional,
    IsString,
    ValidateNested
} from "class-validator";
import {User} from "../../users/domain/user";
import {Entity} from "../../../common/domain/entity";

export class Menu extends Entity {
    @IsString()
    name: string;
    @IsString()
    description: string;
    @IsArray()
    starters: MenuComponent[];
    @IsArray()
    mains: MenuComponent[];
    @IsArray()
    desserts: MenuComponent[];
    @IsInt()
    guests: number;
    @IsInt()
    @IsOptional()
    available?: number;
    @IsNumberString()
    price: number;
    @ValidateNested()
    host: User;
    @IsDateString()
    date: Date;
    @IsString()
    postalCode: string;
    @IsString()
    address: string;
    @IsString()
    country: string;
    @IsArray()
    location: number[];
    @IsBoolean()
    @IsOptional()
    canceled?: boolean;
    average: number;
    distance: number;
}

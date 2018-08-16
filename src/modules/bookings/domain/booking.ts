import {Menu} from "../../menus/domain/menu";
import {User} from "../../users/domain/user";
import {IsBoolean, IsDateString, IsInt, IsOptional, IsString, ValidateNested} from "class-validator";
import {Entity} from "../../../common/domain/entity";

export class Booking extends Entity {
    @IsOptional()
    @IsDateString()
    date?: Date;
    @ValidateNested()
    guest: User;
    @ValidateNested()
    host: User;
    @IsDateString()
    menuDate: Date;
    @IsInt()
    persons: number;
    @IsString()
    @IsOptional()
    comment: string;
    @ValidateNested()
    menu: Menu;
    @IsBoolean()
    @IsOptional()
    confirmed?: boolean;
    @IsBoolean()
    @IsOptional()
    canceled?: boolean;
}

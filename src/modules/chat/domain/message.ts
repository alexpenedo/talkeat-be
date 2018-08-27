import {User} from "../../users/domain/user";
import {IsDateString, IsOptional, IsString, ValidateNested} from "class-validator";
import {Entity} from "../../../common/domain/entity";

export class Message extends Entity{
    @IsDateString()
    date: Date;
    @IsString()
    message: string;
    @ValidateNested()
    @IsOptional()
    from?: User;
}
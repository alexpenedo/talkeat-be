import {User} from "../../users/domain/user";
import {IsDateString, IsInstance, IsOptional, IsString} from "class-validator";
import {Entity} from "../../../common/domain/entity";

export class Message extends Entity{
    @IsDateString()
    date: Date;
    @IsString()
    message: string;
    @IsInstance(User)
    @IsOptional()
    from?: User;
}
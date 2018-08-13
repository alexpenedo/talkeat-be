import {IsEmail, IsOptional, IsString} from "class-validator";
import {Entity} from "../../../common/domain/entity";

export class User extends Entity {

    @IsString()
    name: string;
    @IsString()
    surname: string;
    @IsEmail()
    email: string;
    @IsString()
    mobileNumber: string;
    @IsString()
    password: string;
    @IsString() @IsOptional()
    picture?: string;
    @IsString()
    postalCode: string;
    @IsString()
    address: string;
    @IsString()
    country: string;
}
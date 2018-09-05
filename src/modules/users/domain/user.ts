import {IsEmail, IsOptional, IsString} from "class-validator";
import {Entity} from "../../../common/domain/entity";
import {ApiModelProperty} from "@nestjs/swagger";

export class User extends Entity {
    @ApiModelProperty()
    @IsString()
    name: string;
    @ApiModelProperty()
    @IsString()
    surname: string;
    @ApiModelProperty()
    @IsEmail()
    email: string;
    @ApiModelProperty()
    @IsString()
    mobileNumber: string;
    @ApiModelProperty()
    @IsString()
    password: string;
    @ApiModelProperty()
    @IsString() @IsOptional()
    picture?: string;
    @ApiModelProperty()
    @IsString()
    postalCode: string;
    @ApiModelProperty()
    @IsString()
    address: string;
    @ApiModelProperty()
    @IsString()
    country: string;
}
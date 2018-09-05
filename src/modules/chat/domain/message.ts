import {User} from "../../users/domain/user";
import {IsDateString, IsOptional, IsString, ValidateNested} from "class-validator";
import {Entity} from "../../../common/domain/entity";
import {ApiModelProperty} from "@nestjs/swagger";

export class Message extends Entity{
    @ApiModelProperty()
    @IsDateString()
    date: Date;
    @ApiModelProperty()
    @IsString()
    message: string;
    @ApiModelProperty()
    @ValidateNested()
    @IsOptional()
    from?: User;
}
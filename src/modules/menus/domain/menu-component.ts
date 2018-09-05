import {IsString} from "class-validator";
import {Entity} from "../../../common/domain/entity";
import {ApiModelProperty} from "@nestjs/swagger";

export class MenuComponent extends Entity {
    @ApiModelProperty()
    @IsString()
    name: string;
}
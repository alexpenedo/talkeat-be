import {IsString} from "class-validator";
import {Entity} from "../../../common/domain/entity";

export class MenuComponent extends Entity {
    @IsString()
    name: string;
}
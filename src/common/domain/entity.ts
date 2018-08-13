import {IsOptional, IsString} from "class-validator";

export class Entity {
    @IsOptional() @IsString() _id?: string;
}
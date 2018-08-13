import {IsString} from "class-validator";

export class FindUserMenusRequest {
    @IsString()
    host: string;
    @IsString()
    status: string;
}
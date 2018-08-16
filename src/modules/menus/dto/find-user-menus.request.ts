import {IsNumberString, IsOptional, IsString} from "class-validator";
import {Status} from "../../../common/enums/status.enum";

export class FindUserMenusRequest {
    @IsString()
    host: string;
    @IsString()
    status: Status;
    @IsNumberString()
    @IsOptional()
    page: number;
    @IsNumberString()
    @IsOptional()
    size: number;
}
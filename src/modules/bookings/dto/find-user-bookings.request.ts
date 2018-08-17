import {IsNumberString, IsOptional, IsString} from "class-validator";
import {Status} from "../../../common/enums/status.enum";

export class FindUserBookingsRequest {
    @IsString()
    guest: string;
    @IsString()
    status: Status;
    @IsNumberString()
    @IsOptional()
    page: number;
    @IsNumberString()
    @IsOptional()
    size: number;
}
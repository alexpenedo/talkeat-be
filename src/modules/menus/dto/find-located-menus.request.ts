import {IsDateString, IsNumberString, IsOptional, IsString} from "class-validator";
import {Sort} from "../../../common/enums/sort.enum";

export class FindLocatedMenusRequest {
    @IsNumberString()
    longitude: string;
    @IsNumberString()
    latitude: string;
    @IsNumberString()
    persons: number;
    @IsDateString()
    date: string;
    @IsString()
    type: string;
    @IsString()
    @IsOptional()
    userId?: string;
    @IsString()
    sort: Sort;
    @IsNumberString()
    @IsOptional()
    page: string;
    @IsNumberString()
    @IsOptional()
    size: string;
}

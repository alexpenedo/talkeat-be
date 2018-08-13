import {IsDateString, IsNumberString, IsOptional, IsString} from "class-validator";

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
}

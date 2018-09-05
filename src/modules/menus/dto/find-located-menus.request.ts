import {IsDateString, IsNumberString, IsOptional, IsString} from "class-validator";
import {Sort} from "../../../common/enums/sort.enum";
import {ApiModelProperty} from "@nestjs/swagger";

export class FindLocatedMenusRequest {
    @ApiModelProperty()
    @IsNumberString()
    longitude: string;
    @ApiModelProperty()
    @IsNumberString()
    latitude: string;
    @ApiModelProperty()
    @IsNumberString()
    persons: number;
    @ApiModelProperty()
    @IsDateString()
    date: string;
    @ApiModelProperty()
    @IsString()
    type: string;
    @ApiModelProperty()
    @IsString()
    @IsOptional()
    userId?: string;
    @ApiModelProperty()
    @IsString()
    sort: Sort;
    @ApiModelProperty({required:false})
    @IsNumberString()
    @IsOptional()
    page: string;
    @ApiModelProperty({required:false})
    @IsNumberString()
    @IsOptional()
    size: string;
}

import {ApiModelProperty} from "@nestjs/swagger";

export class Tokens {
    @ApiModelProperty()
    accessToken: string;
    @ApiModelProperty()
    refreshToken: string;
}
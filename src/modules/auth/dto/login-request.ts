import {ApiModelProperty} from "@nestjs/swagger";

export class LoginRequest {
    @ApiModelProperty()
    email: string;
    @ApiModelProperty()
    password: string;
}
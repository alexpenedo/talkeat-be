import {Tokens} from "./tokens";
import {ApiModelProperty} from "@nestjs/swagger";
import {User} from "../../users/domain/user";

export class LoginResponse {
    @ApiModelProperty()
    user: User;
    @ApiModelProperty()
    tokens: Tokens;
}
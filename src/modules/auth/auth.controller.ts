import {BadRequestException, Body, Controller, Post, Request} from '@nestjs/common';

import {AuthService} from './auth.service';
import {ApiUseTags, ApiResponse, ApiOperation} from "@nestjs/swagger";
import {LoginRequest} from "./dto/login-request";
import {LoginResponse} from "./dto/login-response";

@ApiUseTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {
    }

    @Post('/login')
    @ApiOperation({title: 'Login User by email/password'})
    @ApiResponse({
        status: 200,
        description: 'Login successfully',
        type: LoginResponse
    })
    @ApiResponse({status: 401, description: 'Unauthorized'})
    async login(@Body() loginData: LoginRequest) {
        if (!loginData.email || !loginData.password) throw new BadRequestException('Missing email or password');
        return await this.authService.sign(loginData);
    }

    @Post('/refresh-token')
    @ApiOperation({title: 'Refresh Authentication Token'})
    async refreshToken(@Request() req): Promise<any> {
        const body = req.body;
        return await this.authService.refreshToken(body.refreshToken);
    }
}

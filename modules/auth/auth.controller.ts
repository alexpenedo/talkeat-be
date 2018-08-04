import {BadRequestException, Controller, Post, Request} from '@nestjs/common';

import {AuthService} from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Post('/login')
  async login(@Request() req): Promise<any> {
    const body = req.body;

    if (!body) throw new BadRequestException('Body is missing');
    if (!body.email || !body.password) throw new BadRequestException('Missing email or password');

    return await this.authService.sign(body);
  }

  @Post('/refresh-token')
  async refreshToken(@Request() req): Promise<any> {
    const body = req.body;
    return await this.authService.refreshToken(body.refreshToken);
  }
}

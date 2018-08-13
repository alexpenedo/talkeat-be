import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {UserService} from '../users/user.service';
import {JwtService} from './jwt/jwt.service';
import {JwtPayload} from "./interfaces/jwt-payload.interface";
import * as jwt from 'jsonwebtoken';
import {LoginRequest} from "./dto/login-request";
import {LoginResponse} from "./dto/login-response";
import {User} from "../users/domain/user";
import {ConfigService} from "../infrastructure/config/config.service";

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UserService,
                private readonly jwtService: JwtService,
                private config: ConfigService) {
    }

    private async checkUserPassword(signedUser: User, password: string): Promise<Boolean> {
        return bcrypt.compareSync(password, signedUser.password);
    }

    async sign(credentials: LoginRequest): Promise<LoginResponse> {
        const user = await this.usersService.findByEmail(credentials.email);
        if (!user)
            throw new NotFoundException('The specified user does not exists');
        const isValid = await this.checkUserPassword(user, credentials.password);
        if (!isValid)
            throw new BadRequestException('The email/password combination is invalid');
        const tokens = await this.jwtService.generateToken(user);

        return {tokens, user};
    }

    async refreshToken(payload: JwtPayload): Promise<any> {
        payload = jwt.decode(payload, this.config.jwtSecret);
        const user: User = await this.jwtService.validateUser(payload);
        const tokens = await this.jwtService.generateToken(user);
        return {tokens, user};
    }
}

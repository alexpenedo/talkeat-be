import {Injectable} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import {UserService} from '../../users/user.service';
import {JwtPayload} from "../interfaces/jwt-payload.interface";
import {WsException} from "@nestjs/websockets";
import {Tokens} from "../dto/tokens";
import {User} from "../../users/domain/user";
import {ConfigService} from "../../infrastructure/config/config.service";

@Injectable()
export class JwtService {
    constructor(private readonly userService: UserService,
                private readonly config: ConfigService) {
    }

    async generateToken(user: User): Promise<Tokens> {
        const payload: JwtPayload = {
            _id: user._id,
            email: user.email,
        };
        const accessToken = await jwt.sign(payload, this.config.jwtSecret, {
            expiresIn: this.config.accessTokenExpires
        });
        const refreshToken = await jwt.sign(payload, this.config.jwtSecret, {
            expiresIn: this.config.refreshTokenExpires
        });
        return {accessToken, refreshToken};
    }

    async validateUser(payload): Promise<User> {
        return await this.userService.findById(payload._id);
    }

    async verifyWebsocketToken(token: string): Promise<User> {
        try {
            const payload: JwtPayload = jwt.verify(token, this.config.jwtSecret);
            const user = await this.userService.findById(payload._id);
            if (!user) throw new WsException('Unauthorized access');
            return user;
        } catch (err) {
            throw new WsException(err.message);
        }
    }


}

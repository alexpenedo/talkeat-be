import {Injectable} from '@nestjs/common';
import {Model} from 'mongoose';
import * as jwt from 'jsonwebtoken';
import {User} from '../../users/interfaces/user.interface';
import {UserService} from '../../users/user.service';
import config from "../../../config";
import {JwtPayload} from "../interfaces/jwt-payload.interface";
import {WsException} from "@nestjs/websockets";

@Injectable()
export class JwtService {
    constructor(private readonly userService: UserService) {
    }

    async generateToken(user: User): Promise<any> {
        const payload: JwtPayload = {
            _id: user._id,
            email: user.email,
        };
        const accessToken = await jwt.sign(payload, config.jwtSecret, {
            expiresIn: config.accessTokenExpires
        });
        const refreshToken = await jwt.sign(payload, config.jwtSecret, {
            expiresIn: config.refreshTokenExpires
        });

        return {accessToken, refreshToken};
    }

    async validateUser(payload): Promise<any> {
        return await this.userService.findById(payload._id);
    }

    async verifyWebsocketToken(token: string): Promise<User> {
        try {
            const payload: JwtPayload = jwt.verify(token, config.jwtSecret);
            const user = await this.userService.findById(payload._id);
            if (!user) {
                throw new WsException('Unauthorized access');
            }
            return user;
        } catch (err) {
            throw new WsException(err.message);
        }
    }


}

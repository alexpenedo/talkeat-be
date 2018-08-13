import {ExtractJwt, Strategy} from 'passport-jwt';
import {PassportStrategy} from '@nestjs/passport';
import {Injectable, UnauthorizedException} from '@nestjs/common';
import {JwtService} from "./jwt.service";
import {JwtPayload} from "../interfaces/jwt-payload.interface";
import {ConfigService} from "../../infrastructure/config/config.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly jwtService: JwtService,
                private readonly config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.jwtSecret,
        });
    }

    async validate(payload: JwtPayload, done: Function) {
        const user = await this.jwtService.validateUser(payload);
        if (!user) {
            return done(new UnauthorizedException(), false);
        }
        done(null, user);
    }
}
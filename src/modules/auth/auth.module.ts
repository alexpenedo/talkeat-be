import {Module} from '@nestjs/common';
import {UsersModule} from '../users/users.module';
import {AuthService} from './auth.service';
import {JwtService} from './jwt/jwt.service';
import {AuthController} from './auth.controller';
import {JwtStrategy} from "./jwt/jwt.strategy";
import {ConfigModule} from "../infrastructure/config/config.module";

@Module({
    imports: [UsersModule, ConfigModule],
    providers: [AuthService, JwtService, JwtStrategy],
    controllers: [AuthController],
    exports: [JwtService]
})
export class AuthModule {
}

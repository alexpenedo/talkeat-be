import {MongooseModule} from '@nestjs/mongoose';
import {UsersController} from './users.controller';
import {UserService} from './user.service';
import {UserSchema} from './schemas/user.schema';
import {Module} from "@nestjs/common";
import {UserRepository} from "./repositories/user.repository";
import {ConfigModule} from "../infrastructure/config/config.module";

@Module({
    imports: [MongooseModule.forFeature([{name: 'User', schema: UserSchema}]), ConfigModule],
    controllers: [UsersController],
    providers: [UserRepository, UserService],
    exports: [UserService]
})
export class UsersModule {
}
import {MongooseModule} from '@nestjs/mongoose';

import {UsersController} from './users.controller';
import {UserService} from './user.service';
import {UserSchema} from './schemas/user.schema';
import {Module} from "@nestjs/common";
import {UserRepository} from "./repositories/user.repository";

@Module({
    imports: [MongooseModule.forFeature([{name: 'User', schema: UserSchema}]),],
    controllers: [UsersController],
    providers: [UserRepository, UserService],
    exports: [UserService]
})
export class UsersModule {
}

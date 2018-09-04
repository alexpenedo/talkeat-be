import {MongooseModule} from '@nestjs/mongoose';
import {UsersController} from './users.controller';
import {UserService} from './user.service';
import {UserSchema} from './schemas/user.schema';
import {Module} from "@nestjs/common";
import {UserRepository} from "./repositories/user.repository";
import {ConfigModule} from "../infrastructure/config/config.module";
import {AssemblersModule} from "../../common/assemblers/assemblers.module";
import {StorageModule} from "../infrastructure/storage/storage.module";

@Module({
    imports: [MongooseModule.forFeature([{name: 'User', schema: UserSchema}]),
        ConfigModule, AssemblersModule, StorageModule],
    controllers: [UsersController],
    providers: [UserRepository, UserService],
    exports: [UserService]
})
export class UsersModule {
}

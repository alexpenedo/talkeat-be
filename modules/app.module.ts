import {Module} from "@nestjs/common";
import {MongooseModule} from '@nestjs/mongoose';
import config from "../config/config";
import {UsersModule} from "./users/users.module";
import {AuthModule} from "./auth/auth.module";
import {MenusModule} from "./menu/menus.module";
import {BookingsModule} from "./bookings/bookings.module";

@Module({
    imports: [
        MongooseModule.forRoot(config.mongoHost),
        AuthModule,
        UsersModule,
        MenusModule,
        BookingsModule
    ],
})
export class ApplicationModule {
}
import {Module} from "@nestjs/common";
import * as Promise from 'bluebird';
import {MongooseModule} from '@nestjs/mongoose';
import config from "../config/config";
import {UsersModule} from "./users/users.module";
import {AuthModule} from "./auth/auth.module";
import {MenusModule} from "./menus/menus.module";
import {BookingsModule} from "./bookings/bookings.module";
import {RatesModule} from "./rates/rates.module";
import {ChatsModule} from "./chat/chats.module";
import {HealthcheckModule} from "./healthcheck/healthcheck.module";

@Module({
    imports: [
        MongooseModule.forRoot(config.mongoHost, {promiseLibrary: Promise}),
        HealthcheckModule,
        AuthModule,
        UsersModule,
        MenusModule,
        BookingsModule,
        RatesModule,
        ChatsModule,
    ],
})
export class ApplicationModule {
}
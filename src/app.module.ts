import {Module} from "@nestjs/common";
import * as Promise from 'bluebird';
import {MongooseModule} from '@nestjs/mongoose';
import config from "./config";
import {UsersModule} from "./modules/users/users.module";
import {AuthModule} from "./modules/auth/auth.module";
import {MenusModule} from "./modules/menus/menus.module";
import {BookingsModule} from "./modules/bookings/bookings.module";
import {RatesModule} from "./modules/rates/rates.module";
import {ChatsModule} from "./modules/chat/chats.module";
import {HealthcheckModule} from "./modules/healthcheck/healthcheck.module";

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
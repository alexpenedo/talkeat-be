import {Module} from "@nestjs/common";
import {UsersModule} from "./modules/users/users.module";
import {AuthModule} from "./modules/auth/auth.module";
import {MenusModule} from "./modules/menus/menus.module";
import {BookingsModule} from "./modules/bookings/bookings.module";
import {RatesModule} from "./modules/rates/rates.module";
import {ChatsModule} from "./modules/chat/chats.module";
import {HealthcheckModule} from "./modules/healthcheck/healthcheck.module";
import {ConfigModule} from "./modules/infrastructure/config/config.module";
import {ConfigService} from "./modules/infrastructure/config/config.service";
import {DatabaseModule} from "./modules/infrastructure/database/database.module";

const config = new ConfigService(`${process.env.NODE_ENV}.env`);

@Module({
    imports: [
        ConfigModule,
        DatabaseModule.forRoot(config),
        HealthcheckModule,
        AuthModule,
        UsersModule,
        MenusModule,
        BookingsModule,
        RatesModule,
        ChatsModule,
    ],
    exports: [ConfigModule]
})
export class ApplicationModule {
}
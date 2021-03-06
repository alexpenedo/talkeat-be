import {Module} from "@nestjs/common";
import {UsersModule} from "./modules/users/users.module";
import {AuthModule} from "./modules/auth/auth.module";
import {MenusModule} from "./modules/menus/menus.module";
import {BookingsModule} from "./modules/bookings/bookings.module";
import {RatesModule} from "./modules/rates/rates.module";
import {ChatsModule} from "./modules/chat/chats.module";
import {HealthcheckModule} from "./modules/healthcheck/healthcheck.module";
import {ConfigModule} from "./modules/infrastructure/config/config.module";
import {DatabaseModule} from "./modules/infrastructure/database/database.module";
import {AssemblersModule} from "./common/assemblers/assemblers.module";
import {StorageModule} from "./modules/infrastructure/storage/storage.module";

@Module({
    imports: [
        ConfigModule,
        DatabaseModule,
        StorageModule,
        AssemblersModule,
        HealthcheckModule,
        AuthModule,
        UsersModule,
        MenusModule,
        BookingsModule,
        RatesModule,
        ChatsModule,
    ]
})
export class ApplicationModule {
}
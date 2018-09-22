import {Module} from '@nestjs/common';
import {ConfigService} from "../config/config.service";
import {MongooseModule} from "@nestjs/mongoose";
import {ConfigModule} from "../config/config.module";

@Module({
    imports: [MongooseModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: async (config: ConfigService) => ({
            uri: config.mongoUri, useNewUrlParser: true
        }),
        inject: [ConfigService],
    })]
})

export class DatabaseModule {
}
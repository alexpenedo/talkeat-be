import {DynamicModule} from '@nestjs/common';
import {ConfigService} from "../config/config.service";
import {MongooseModule} from "@nestjs/mongoose";

export class DatabaseModule {
    static forRoot(config: ConfigService): DynamicModule {
        const mongoOptions = {useNewUrlParser: true};
        return {
            module: DatabaseModule,
            imports: [MongooseModule.forRoot(config.mongoUri, mongoOptions)]
        };
    }
}
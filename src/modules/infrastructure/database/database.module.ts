import {DynamicModule} from '@nestjs/common';
import {ConfigService} from "../config/config.service";
import {MongooseModule} from "@nestjs/mongoose";

export class DatabaseModule {
    static forRoot(config: ConfigService): DynamicModule {
        const mongoHost = `${config.mongoHost}:${config.mongoPort}/${config.mongoSchema}`;
        return {
            module: DatabaseModule,
            imports: [MongooseModule.forRoot(mongoHost)]
        };
    }
}
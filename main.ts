import { NestFactory } from '@nestjs/core';
import config from "./config/config";
import {ApplicationModule} from "./modules/app.module";

async function bootstrap() {
    const app = await NestFactory.create(ApplicationModule);
    app.setGlobalPrefix('api');
    await app.listen(config.port);
}
bootstrap();
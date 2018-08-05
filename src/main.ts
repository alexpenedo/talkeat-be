import {NestFactory} from '@nestjs/core';
import config from "./config";
import {ApplicationModule} from "./app.module";

async function bootstrap() {
    const logger = config.isDevelopmentEnv ? console : false;
    const app = await NestFactory.create(ApplicationModule, {logger});
    app.setGlobalPrefix('api');
    app.enableCors();
    await app.listen(config.port);
}

bootstrap();
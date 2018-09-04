import {NestFactory} from '@nestjs/core';
import {SwaggerModule, DocumentBuilder} from '@nestjs/swagger';
import {ApplicationModule} from "./app.module";
import {RedisIoAdapter} from "./modules/infrastructure/adapters/redis-adapter";

declare const module: any;

async function bootstrap() {
    const app = await NestFactory.create(ApplicationModule);
    app.useWebSocketAdapter(new RedisIoAdapter(app.getHttpServer()));
    app.setGlobalPrefix('api');
    app.enableCors();

    const options = new DocumentBuilder()
        .setTitle('Talkeat')
        .setDescription('Talkeat Backend API')
        .setVersion('1.0')
        .setBasePath('/api')
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('swagger', app, document);
    const port = app.get('ConfigService')['envConfig']['PORT'];
    await app.listen(port);

    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }

}

bootstrap();
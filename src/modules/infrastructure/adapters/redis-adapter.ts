import {IoAdapter} from '@nestjs/websockets';
import * as redisIoAdapter from 'socket.io-redis';
import {ConfigService} from "../config/config.service";

export class RedisIoAdapter extends IoAdapter {
    createIOServer(port: number, options?: any): any {
        const server = super.createIOServer(port, options);
        const config = new ConfigService(`env/${process.env.NODE_ENV}.env`);
        if (config.redisHost) {
            server.adapter(redisIoAdapter({
                host: config.redisHost,
                port: config.redisPort
            }));
        }
        return server;
    }
}
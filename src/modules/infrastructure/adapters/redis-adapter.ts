import {IoAdapter} from '@nestjs/websockets';
import * as redisIoAdapter from 'socket.io-redis';
import {ConfigService} from "../config/config.service";

const config = new ConfigService(`env/${process.env.NODE_ENV}.env`);

const redisAdapter = redisIoAdapter({host: config.redisHost, port: config.redisPort});

export class RedisIoAdapter extends IoAdapter {
    createIOServer(port: number, options?: any): any {
        const server = super.createIOServer(port, options);
        server.adapter(redisAdapter);
        return server;
    }
}
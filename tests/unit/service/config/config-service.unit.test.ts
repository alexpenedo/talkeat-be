import {Test} from "@nestjs/testing";
import {UserBuilder} from "../../../builders/user.builder";
import {ChatRepository} from "../../../../src/modules/chat/repositories/chat.repository";
import {BookingService} from "../../../../src/modules/bookings/booking.service";
import {ChatService} from "../../../../src/modules/chat/chat.service";
import {BookingBuilder} from "../../../builders/booking.builder";
import {MenuBuilder} from "../../../builders/menu.builder";
import {UserRepository} from "../../../../src/modules/users/repositories/user.repository";
import * as faker from 'faker';
import {ConfigService} from "../../../../src/modules/infrastructure/config/config.service";
import {BookingRepository} from "../../../../src/modules/bookings/repositories/booking.repository";
import {MenuRepository} from "../../../../src/modules/menus/repositories/menu.repository";
import {ChatBuilder} from "../../../builders/chat.builder";
import {MessageBuilder} from "../../../builders/message.builder";
import * as _ from 'lodash';
import {NotFoundException} from "@nestjs/common";
import {ConfigModule} from "../../../../src/modules/infrastructure/config/config.module";

describe('ConfigService Unit tests', () => {
    let configService: ConfigService;
    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [ConfigModule]
        }).compile();
        configService = module.get<ConfigService>(ConfigService);
    });

    describe('get configService values', () => {
        it('should get test.env values', async () => {
            expect(configService.env).toBe(process.env.NODE_ENV);
            expect(configService.isDevelopmentEnv).toBe(false);
            expect(configService.port).toBe(3977);
            expect(configService.jwtSecret).toBe('test-secret');
            expect(configService.mongoDebug).toBe(false);
            expect(configService.accessTokenExpires).toBe('1h');
            expect(configService.refreshTokenExpires).toBe('8h');
            expect(configService.bcryptSaltRounds).toBe(10);
            expect(configService['env']).toBe(process.env.NODE_ENV);
        });
    });
});
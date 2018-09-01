import {Test} from "@nestjs/testing";
import {MongooseModule} from "@nestjs/mongoose";
import {UserSchema} from "../../src/modules/users/schemas/user.schema";
import {MenuRepository} from "../../src/modules/menus/repositories/menu.repository";
import {UserRepository} from "../../src/modules/users/repositories/user.repository";
import {MenuBuilder} from "../builders/menu.builder";
import {UserBuilder} from "../builders/user.builder";
import MenuSchema from "../../src/modules/menus/schemas/menu.schema";
import {TestingModule} from "@nestjs/testing/testing-module";
import * as jwt from 'jsonwebtoken';
import {ApplicationModule} from "../../src/app.module";
import {ConfigService} from "../../src/modules/infrastructure/config/config.service";
import * as mongoose from "mongoose";
import BookingSchema from "../../src/modules/bookings/schemas/booking.schema";
import {BookingRepository} from "../../src/modules/bookings/repositories/booking.repository";
import {BookingBuilder} from "../builders/booking.builder";
import {BookingAssembler} from "../../src/common/assemblers/booking-assembler";
import RateSchema from "../../src/modules/rates/schemas/rate.schema";
import {RateRepository} from "../../src/modules/rates/repositories/rate.repository";
import {RateAssembler} from "../../src/common/assemblers/rate-assembler";
import {RateBuilder} from "../builders/rate.builder";
import {MenuAssembler} from "../../src/common/assemblers/menu-assembler";
import {UserAssembler} from "../../src/common/assemblers/user-assembler";
import {ChatAssembler} from "../../src/common/assemblers/chat-assembler";
import ChatSchema from "../../src/modules/chat/schemas/chat.schema";

export default class TestUtil {
    private static module: TestingModule;
    private static config;

    static async run() {
        process.env.NODE_ENV = 'test';
        this.module = await Test.createTestingModule({
            imports: [ApplicationModule,
                MongooseModule.forFeature([{name: 'User', schema: UserSchema}]),
                MongooseModule.forFeature([{name: 'Menu', schema: MenuSchema}]),
                MongooseModule.forFeature([{name: 'Booking', schema: BookingSchema}]),
                MongooseModule.forFeature([{name: 'CHat', schema: ChatSchema}]),
                MongooseModule.forFeature([{name: 'Rate', schema: RateSchema}]),
            ],
            providers: [UserAssembler, MenuAssembler, BookingAssembler, RateAssembler, ChatAssembler,
                UserRepository, MenuRepository, BookingRepository, RateRepository,
                MenuBuilder, UserBuilder, BookingBuilder, RateBuilder],
            exports: [MenuBuilder, UserBuilder, BookingBuilder, RateBuilder]
        }).compile();

        const app = await this.module.createNestApplication().init();
        this.config = this.module.get<ConfigService>(ConfigService);
        return app.getHttpServer();
    }

    static async getToken(user?) {
        if (!user) {
            user = await this.userBuilder().withValidData().store();
        }
        const jwtSecret = this.config.jwtSecret;
        return await jwt.sign({_id: user._id, email: user.email,}, jwtSecret);
    }

    //UTILS
    static async clearDatabase() {
        await mongoose.connect(`${this.config.mongoHost}:${this.config.mongoPort}/${this.config.mongoSchema}`, {useNewUrlParser: true});
        await mongoose.connection.collection('users').remove({});
        await mongoose.connection.collection('menus').remove({});
        await mongoose.connection.collection('bookings').remove({});
        await mongoose.connection.collection('rates').remove({});

    }


    //BUILDERS
    static userBuilder() {
        return this.module.get<UserBuilder>(UserBuilder);
    }

    static menuBuilder() {
        return this.module.get<MenuBuilder>(MenuBuilder);
    }

    static bookingBuilder() {
        return this.module.get<BookingBuilder>(BookingBuilder);
    }

    static rateBuilder() {
        return this.module.get<RateBuilder>(RateBuilder);
    }


}
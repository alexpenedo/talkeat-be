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

export default class TestUtil {
    private static module: TestingModule;
    private static config;

    static async run() {
        process.env.NODE_ENV = 'test';
        this.module = await Test.createTestingModule({
            imports: [ApplicationModule,
                MongooseModule.forFeature([{name: 'User', schema: UserSchema}]),
                MongooseModule.forFeature([{name: 'Menu', schema: MenuSchema}])],
            providers: [MenuRepository, UserRepository, MenuBuilder, UserBuilder],
            exports: [MenuBuilder, UserBuilder]
        }).compile();

        const app = await this.module.createNestApplication().init();
        this.config = this.module.get<ConfigService>(ConfigService);
        return app.getHttpServer();
    }

    static async getToken(user) {
        const jwtSecret = this.config.jwtSecret;
        return await jwt.sign({_id: user._id, email: user.email,}, jwtSecret);
    }

    //UTILS
    static clearDatabase() {
        mongoose.connect(`${this.config.mongoHost}:${this.config.mongoPort}/${this.config.mongoSchema}`, function () {
            mongoose.connection.db.dropCollection('users');
            mongoose.connection.db.dropCollection('menus');
        });
    }


    //BUILDERS
    static userBuilder() {
        return this.module.get<UserBuilder>(UserBuilder);
    }

    static menuBuilder() {
        return this.module.get<MenuBuilder>(MenuBuilder);
    }

}
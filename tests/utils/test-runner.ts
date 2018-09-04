import {Test} from "@nestjs/testing";
import {TestingModule} from "@nestjs/testing/testing-module";
import {ApplicationModule} from "../../src/app.module";
import {ConfigService} from "../../src/modules/infrastructure/config/config.service";
import {BuildersModule} from "../builders/builders.module";

export default class TestRunner {
    private static module: TestingModule;
    public static config;

    static async run() {
        this.module = await Test.createTestingModule({
            imports: [ApplicationModule, BuildersModule]
        }).compile();

        const app = await this.module.createNestApplication().init();
        this.config = this.module.get<ConfigService>(ConfigService);
        await app.listenAsync(this.config.port);
        return app.getHttpServer();
    }

    static testingModule() {
        return this.module;
    }
}

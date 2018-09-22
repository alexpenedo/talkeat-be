import {Module} from '@nestjs/common';
import {DemoController} from './demo.controller';
import {ConfigModule} from "../infrastructure/config/config.module";
import {BuildersModule} from "../../../tests/builders/builders.module";
import {DemoService} from "./demo.service";

@Module({
    imports: [BuildersModule, ConfigModule],
    providers: [DemoService],
    controllers: [DemoController]
})
export class DemoModule {
}

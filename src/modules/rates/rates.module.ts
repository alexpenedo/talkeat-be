import {MongooseModule} from '@nestjs/mongoose';
import {Module} from "@nestjs/common";
import {RateRepository} from "./repositories/rate.repository";
import RateSchema from "./schemas/rate.schema";
import {RatesController} from "./rates.controller";
import {RateService} from "./rate.service";
import {AssemblersModule} from "../../common/assemblers/assemblers.module";

@Module({
    imports: [MongooseModule.forFeature([{name: 'Rate', schema: RateSchema}]), AssemblersModule],
    controllers: [RatesController],
    providers: [RateRepository, RateService],
    exports: [RateService]
})

export class RatesModule {
}

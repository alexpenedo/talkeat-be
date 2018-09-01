import {MongooseModule} from '@nestjs/mongoose';
import {forwardRef, Module} from "@nestjs/common";
import {BookingRepository} from "./repositories/booking.repository";
import BookingSchema from "./schemas/booking.schema";
import {BookingsController} from "./bookings.controller";
import {BookingService} from "./booking.service";
import {MenusModule} from "../menus/menus.module";
import {RatesModule} from "../rates/rates.module";
import {AssemblersModule} from "../../common/assemblers/assemblers.module";

@Module({
    imports: [MongooseModule.forFeature([{name: 'Booking', schema: BookingSchema}]),
        RatesModule, forwardRef(() => MenusModule), AssemblersModule],
    controllers: [BookingsController],
    providers: [BookingRepository, BookingService],
    exports: [BookingService]
})

export class BookingsModule {
}

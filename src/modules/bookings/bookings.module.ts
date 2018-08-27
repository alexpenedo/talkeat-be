import {MongooseModule} from '@nestjs/mongoose';
import {forwardRef, Module} from "@nestjs/common";
import {BookingRepository} from "./repositories/booking.repository";
import BookingSchema from "./schemas/booking.schema";
import {BookingsController} from "./bookings.controller";
import {BookingService} from "./booking.service";
import {MenusModule} from "../menus/menus.module";
import {RatesModule} from "../rates/rates.module";
import {BookingAssembler} from "./assemblers/booking-assembler";

@Module({
    imports: [MongooseModule.forFeature([{name: 'Booking', schema: BookingSchema}]),
        RatesModule,
        forwardRef(() => MenusModule)],
    controllers: [BookingsController],
    providers: [BookingRepository, BookingService, BookingAssembler],
    exports: [BookingService]
})

export class BookingsModule {
}

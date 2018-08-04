import {MongooseModule} from '@nestjs/mongoose';
import {forwardRef, Module} from "@nestjs/common";
import {BookingRepository} from "./repositories/booking.repository";
import BookingSchema from "./schemas/booking.schema";
import {BookingsController} from "./bookings.controller";
import {BookingService} from "./booking.service";
import {MenusModule} from "../menus/menus.module";

@Module({
    imports: [MongooseModule.forFeature([{name: 'Booking', schema: BookingSchema}]),
        forwardRef(() => MenusModule)],
    controllers: [BookingsController],
    providers: [BookingRepository, BookingService],
    exports: [BookingService]
})

export class BookingsModule {
}

import {MongooseModule} from '@nestjs/mongoose';
import {forwardRef, Module} from "@nestjs/common";
import {BookingRepository} from "./repositories/booking.repository";
import BookingSchema from "./schemas/booking.schema";
import {BookingController} from "./booking.controller";
import {BookingService} from "./booking.service";
import {MenusModule} from "../menu/menus.module";

@Module({
    imports: [MongooseModule.forFeature([{name: 'Booking', schema: BookingSchema}]),
        forwardRef(() => MenusModule)],
    controllers: [BookingController],
    providers: [BookingRepository, BookingService],
    exports: [BookingService]
})

export class BookingsModule {
}

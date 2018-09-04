import {Module} from "@nestjs/common";
import {UserBuilder} from "./user.builder";
import {MenuBuilder} from "./menu.builder";
import {BookingBuilder} from "./booking.builder";
import {RateBuilder} from "./rate.builder";
import {ChatBuilder} from "./chat.builder";
import {MessageBuilder} from "./message.builder";
import {AssemblersModule} from "../../src/common/assemblers/assemblers.module";
import {UserRepository} from "../../src/modules/users/repositories/user.repository";
import {MenuRepository} from "../../src/modules/menus/repositories/menu.repository";
import {BookingRepository} from "../../src/modules/bookings/repositories/booking.repository";
import {RateRepository} from "../../src/modules/rates/repositories/rate.repository";
import {ChatRepository} from "../../src/modules/chat/repositories/chat.repository";
import {UserSchema} from "../../src/modules/users/schemas/user.schema";
import MenuSchema from "../../src/modules/menus/schemas/menu.schema";
import BookingSchema from "../../src/modules/bookings/schemas/booking.schema";
import ChatSchema from "../../src/modules/chat/schemas/chat.schema";
import RateSchema from "../../src/modules/rates/schemas/rate.schema";
import {MongooseModule} from "@nestjs/mongoose";

@Module({
    imports: [AssemblersModule,
        MongooseModule.forFeature([{name: 'User', schema: UserSchema}]),
        MongooseModule.forFeature([{name: 'Menu', schema: MenuSchema}]),
        MongooseModule.forFeature([{name: 'Booking', schema: BookingSchema}]),
        MongooseModule.forFeature([{name: 'Chat', schema: ChatSchema}]),
        MongooseModule.forFeature([{name: 'Rate', schema: RateSchema}])],
    providers: [UserBuilder, MenuBuilder, BookingBuilder, RateBuilder, ChatBuilder, MessageBuilder,
        UserRepository, MenuRepository, BookingRepository, RateRepository, ChatRepository],
    exports: [UserBuilder, MenuBuilder, BookingBuilder, RateBuilder, ChatBuilder, MessageBuilder],
})

export class BuildersModule {
}

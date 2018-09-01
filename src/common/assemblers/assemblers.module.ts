import {Module} from "@nestjs/common";
import {BookingAssembler} from "./booking-assembler";
import {UserAssembler} from "./user-assembler";
import {MenuAssembler} from "./menu-assembler";
import {RateAssembler} from "./rate-assembler";
import {ChatAssembler} from "./chat-assembler";

@Module({
    providers: [UserAssembler, MenuAssembler, BookingAssembler, RateAssembler, ChatAssembler],
    exports: [UserAssembler, MenuAssembler, BookingAssembler, RateAssembler, ChatAssembler]
})

export class AssemblersModule {
}

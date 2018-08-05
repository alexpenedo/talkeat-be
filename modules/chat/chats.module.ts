import {MongooseModule} from '@nestjs/mongoose';
import {Module} from "@nestjs/common";
import {ChatRepository} from "./repositories/chat.repository";
import ChatSchema from "./schemas/chat.schema";
import {ChatsController} from "./chats.controller";
import {ChatService} from "./chat.service";
import {BookingsModule} from "../bookings/bookings.module";
import {ChatGateway} from "./chat.gateway";
import {AuthModule} from "../auth/auth.module";

@Module({
    imports: [MongooseModule.forFeature([{name: 'Chat', schema: ChatSchema}]),AuthModule, BookingsModule],
    controllers: [ChatsController],
    providers: [ChatRepository, ChatService, ChatGateway],
    exports: [ChatService]
})

export class ChatsModule {
}

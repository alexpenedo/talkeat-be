import {MongooseModule} from '@nestjs/mongoose';
import {Module} from "@nestjs/common";
import {ChatRepository} from "./repositories/chat.repository";
import ChatSchema from "./schemas/chat.schema";
import {ChatsController} from "./chats.controller";
import {ChatService} from "./chat.service";

@Module({
    imports: [MongooseModule.forFeature([{name: 'Chat', schema: ChatSchema}])],
    controllers: [ChatsController],
    providers: [ChatRepository, ChatService],
    exports: [ChatService]
})

export class ChatsModule {
}

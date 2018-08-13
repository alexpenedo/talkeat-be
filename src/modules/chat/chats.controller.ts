import {Controller, Get, Req, UseGuards} from '@nestjs/common';
import {ChatService} from './chat.service';
import {AuthGuard} from "@nestjs/passport";
import {ApiUseTags} from "@nestjs/swagger";
import {User} from "../users/domain/user";

@ApiUseTags('Chat')
@Controller('chats')
export class ChatsController {
    constructor(private readonly chatService: ChatService) {
    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    async getHostRates(@Req() request) {
        const user: User = request.user;
        return await this.chatService.findUserChats(user._id);
    }
}

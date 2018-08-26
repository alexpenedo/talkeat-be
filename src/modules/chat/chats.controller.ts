import {Controller, Get, Req, UseGuards} from '@nestjs/common';
import {ChatService} from './chat.service';
import {AuthGuard} from "@nestjs/passport";
import {ApiUseTags, ApiOperation} from "@nestjs/swagger";
import {User} from "../users/domain/user";

@ApiUseTags('Chat')
@Controller('chats')
export class ChatsController {
    constructor(private readonly chatService: ChatService) {
    }

    @Get()
    @ApiOperation({title: 'Get user chats'})
    @UseGuards(AuthGuard('jwt'))
    async getUserChats(@Req() request) {
        const user: User = request.user;
        return await this.chatService.findUserChats(user._id);
    }
}

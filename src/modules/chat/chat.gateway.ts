import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse
} from "@nestjs/websockets";
import {ChatService} from "./chat.service";
import {Chat} from "./interfaces/chat.interface";
import {UseGuards} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {Booking} from "../bookings/interfaces/booking.interface";
import {Menu} from "../menus/interfaces/menu.interface";
import {JwtService} from "../auth/jwt/jwt.service";
import {User} from "../users/interfaces/user.interface";

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server;

    constructor(private chatService: ChatService, private jwtService: JwtService) {
    }

    async handleConnection(socket) {
        const user: User = await this.jwtService.verifyWebsocketToken(socket.handshake.query.token);
        socket.join(user._id);
        socket.user = user;
    }

    async handleDisconnect(socket) {
        // const user: User = await this.jwtService.verifyWebsocketToken(socket.handshake.query.token);
        // socket.leave(user._id);
    }

    @SubscribeMessage('firstMessage')
    onFirstMessage(client, data) {
        const booking: Booking = data as Booking;
        this.chatService.create(booking, this.server);
    }

    @SubscribeMessage('message')
    onMessage(client, data) {
        this.chatService.pushMessageOnChat(data.chat._id, data.message, this.server, data.from);
    }

    @SubscribeMessage('notification')
    onNotification(client, data) {
        const menu: Menu = data as Menu;
        this.chatService.saveChatMessagesOnUpdateMenu(menu._id, this.server);
    }

    @SubscribeMessage('closeChat')
    onCloseChat(client, data) {
        const chat: Chat = data as Chat;
        this.chatService.updateUsersConnectionDates(client.user._id, chat._id);
    }

}
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from "@nestjs/websockets";
import {ChatService} from "./chat.service";
import {Chat} from "./domain/chat";
import {Booking} from "../bookings/domain/booking";
import {Menu} from "../menus/domain/menu";
import {JwtService} from "../auth/jwt/jwt.service";
import {User} from "../users/domain/user";
import {Notification} from "../../common/enums/notification.enum";

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
        const menu: Menu = data.menu as Menu;
        const notification: Notification = data.notification as Notification;
        let content: string;
        if (notification == Notification.UPDATE) {
            content = 'Menu updated by host. Please, check the changes';
        }
        else if (notification == Notification.CANCEL) {
            content = 'Menu canceled by host. Sorry.';
        }
        this.chatService.saveChatMessagesOnNotificationMenu(menu._id, content, this.server);

    }

    @SubscribeMessage('changeBookingState')
    async onChangeBookingState(client, data) {
        const booking: Booking = data as Booking;
        const chat = await this.chatService.getBookingChat(booking._id);
        this.server.to(chat.guest._id).emit('changeBookingState', chat);
    }

    @SubscribeMessage('closeChat')
    onCloseChat(client, data) {
        const chat: Chat = data as Chat;
        this.chatService.updateUsersConnectionDates(client.user._id, chat._id);
    }

}
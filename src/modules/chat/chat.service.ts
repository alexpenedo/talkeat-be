import {Injectable, NotFoundException} from '@nestjs/common';
import {ChatRepository} from "./repositories/chat.repository";
import {Booking} from "../bookings/domain/booking";
import {Chat} from "./domain/chat";
import {Message} from "./domain/message";
import {BookingService} from "../bookings/booking.service";
import * as _ from 'lodash';
import {User} from "../users/domain/user";

@Injectable()
export class ChatService {
    constructor(private chatRepository: ChatRepository, private readonly bookingService: BookingService) {
    }

    async create(booking: Booking, socket?: any): Promise<Chat> {
        const date = new Date();
        const message = {
            date,
            message: "I would like to book this menus",
            from: booking.guest
        };
        let chat: Chat = {
            booking,
            messages: [message],
            hostLastConnection: date,
            guestLastConnection: date
        } as Chat;

        chat = await this.chatRepository.save(chat);
        if (socket) {
            socket.to(chat.booking.guest._id).emit('newChat', chat);
            socket.to(chat.booking.menu.host._id).emit('newChat', chat);
        }
        return chat;
    }

    async getBookingChat(bookingId: string): Promise<Chat> {
        const booking: Booking = await this.bookingService.findById(bookingId);
        return this.chatRepository.findByBookingId(booking._id);
    }

    async pushMessageOnChat(chatId: string, content: string, socket?, user?: User): Promise<Chat> {
        await this.findById(chatId);
        const message: Message = {
            date: new Date(),
            message: content
        } as Message;
        if (user) {
            message.from = user;
        }
        const chat: Chat = await this.chatRepository.pushChatMessage(chatId, message);
        if (socket) {
            if (user._id == chat.booking.menu.host._id) {
                socket.to(chat.booking.guest._id).emit('message', chat);
            }
            if (user._id == chat.booking.guest._id) {
                socket.to(chat.booking.menu.host._id).emit('message', chat);
            }
        }
        return chat;
    }

    async saveChatMessagesOnNotificationMenu(menuId: string, content: string, socket?: any): Promise<Chat[]> {
        const bookings: Booking[] = await this.bookingService.findByMenuId(menuId);
        const bookingIds: string[] = _.map(bookings, '_id');
        const chats: Chat[] = await this.chatRepository.findByBookingIdIn(bookingIds);
        return Promise.all(_.each(chats, async (chat: Chat) => {
            await this.pushMessageOnChat(chat._id, content, socket);
        }));
    }

    async updateUsersConnectionDates(userId: string, chatId: string) {
        await this.chatRepository.updateGuestConnectionDateByChatId(chatId, userId, new Date(), new Date());
        await this.chatRepository.updateHostConnectionDateByChatId(chatId, userId, new Date(), new Date());
    }


    async findUserChats(userId: string): Promise<Chat[]> {
        return await this.chatRepository.findByGuestIdOrHostIdAndDateFrom(userId, userId, new Date());
    }

    async findById(id: string): Promise<Chat> {
        const chat: Chat = await this.chatRepository.findById(id);
        if (!chat) {
            throw  new NotFoundException('Chat not found');
        }
        return chat;
    }
}

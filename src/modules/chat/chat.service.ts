import {Injectable} from '@nestjs/common';
import {Model} from 'mongoose';
import {ChatRepository} from "./repositories/chat.repository";
import {Booking} from "../bookings/interfaces/booking.interface";
import {Chat} from "./interfaces/chat.interface";
import {Message} from "./interfaces/message.interface";
import {User} from "../users/interfaces/user.interface";
import {BookingService} from "../bookings/booking.service";
import * as _ from 'lodash';

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
            menuDate: booking.menuDate,
            host: booking.host,
            guest: booking.guest,
            messages: [message],
            hostLastConnection: date,
            guestLastConnection: date
        } as Chat;

        chat = await this.chatRepository.save(chat);
        if (socket) {
            socket.to(chat.guest._id).emit('newChat', chat);
            socket.to(chat.host._id).emit('newChat', chat);
        }
        return chat;
    }

    async getBookingChat(bookingId: string): Promise<Chat> {
        return this.chatRepository.findByBookingId(bookingId);
    }

    async pushMessageOnChat(chatId: string, content: string, socket?, user?: User): Promise<Chat> {
        const message: Message = {
            date: new Date(),
            message: content
        } as Message;
        if (user) {
            message.from = user;
        }
        const chat: Chat = await this.chatRepository.pushChatMessage(chatId, message);
        if (socket) {
            socket.to(chat.guest._id).emit('message', chat);
            socket.to(chat.host._id).emit('message', chat);
        }
        return chat;
    }

    async saveChatMessagesOnUpdateMenu(menuId: string, socket?: any) {
        const bookings: Booking[] = await this.bookingService.findByMenuId(menuId);
        const bookingIds: string[] = _.map(bookings, '_id');
        const chats: Chat[] = await this.chatRepository.findByBookingIdIn(bookingIds);
        const content = 'Menu updated by host. Please, check the changes';
        _.each(chats, (chat: Chat) => {
            this.pushMessageOnChat(chat._id, content, socket);
        })
    }

    async updateUsersConnectionDates(userId: string, chatId: string) {
        this.chatRepository.updateGuestConnectionDateByChatId(chatId, userId, new Date(), new Date());
        this.chatRepository.updateHostConnectionDateByChatId(chatId, userId, new Date(), new Date());
    }


    async findUserChats(userId: string): Promise<Chat[]> {
        return await this.chatRepository.findByGuestIdOrHostIdAndDateFrom(userId, userId, new Date());
    }

    async findById(id: string): Promise<Chat> {
        return await this.chatRepository.findById(id);
    }

    async update(id: string, newValue: Chat): Promise<Chat> {
        return await this.chatRepository.update(id, newValue);
    }

    async delete(id: string): Promise<Chat> {
        return await this.chatRepository.delete(id);
    }
}

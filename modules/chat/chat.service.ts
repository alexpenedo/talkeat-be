import {Injectable} from '@nestjs/common';
import {Model} from 'mongoose';
import {ChatRepository} from "./repositories/chat.repository";
import {Booking} from "../bookings/interfaces/booking.interface";
import {Chat} from "./interfaces/chat.interface";
import {Message} from "./interfaces/message.interface";
import {User} from "../users/interfaces/user.interface";

@Injectable()
export class ChatService {
    constructor(private chatRepository: ChatRepository) {
    }

    async create(booking: Booking): Promise<Chat> {
        const date = new Date();
        const message = {
            date,
            message: "I would like to book this menus",
            from: booking.guest
        };
        const chat: Chat = {
            booking,
            menuDate: booking.menuDate,
            host: booking.host,
            guest: booking.guest,
            messages: [message],
            hostLastConnection: date,
            guestLastConnection: date
        } as Chat;

        return await this.chatRepository.save(chat);
    }

    async getBookingChat(bookingId: string): Promise<Chat> {
        return this.chatRepository.findByBookingId(bookingId);
    }

    async pushMessageOnChat(chatId: string, content: string, user: User): Promise<Chat> {
        const message: Message = {
            date: new Date(),
            message: content
        }as Message;
        if (user) {
            message.from = user;
        }
        return await this.chatRepository.pushChatMessage(chatId, message);
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

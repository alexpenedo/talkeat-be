import {BaseRepository} from "../../../common/repositories/base.repository";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Message} from "../domain/message";
import {Chat} from "../domain/chat";
import {Injectable} from "@nestjs/common";

@Injectable()
export class ChatRepository extends BaseRepository<Chat> {
    constructor(@InjectModel('Chat') private readonly chatModel) {
        super(chatModel);
    }

    async findByBookingId(bookingId: string): Promise<Chat> {
        return await this.chatModel.findOne({booking: bookingId}).exec();
    }

    async findByBookingIdIn(bookingIds: string[]): Promise<Chat[]> {
        return await this.chatModel.find({booking: {$in: bookingIds}}).exec();
    }

    async pushChatMessage(id: string, message: Message): Promise<Chat> {
        await this.chatModel.findByIdAndUpdate(id, {$push: {messages: message}}).exec();
        return await this.findById(id);
    }

    async findByGuestIdOrHostIdAndDateFrom(hostId: string, guestId: string, dateFrom: Date): Promise<Chat[]> {
        const query = {
            $and: [{menuDate: {$gte: dateFrom}}, {$or: [{host: hostId}, {guest: guestId}]}]
        };
        return await this.chatModel.find(query).populate('guest host')
            .populate({
                path: 'booking',
                model: 'Booking',
                populate: {
                    path: 'menu',
                    model: 'Menu'
                }
            }).exec();
    }

    async updateHostConnectionDateByChatId(chatId: string, hostId: string, dateFrom: Date, connectionDate: Date): Promise<Chat> {
        const query = this.buildQueryChatIdsInAndDateFrom(chatId, dateFrom);
        query.$and.push({host: hostId});
        return await this.chatModel.update(query, {hostLastConnection: connectionDate}, {multi: true}).exec();
    }

    async updateGuestConnectionDateByChatId(chatId: string, guestId: string, dateFrom: Date, connectionDate: Date): Promise<Chat> {
        const query = this.buildQueryChatIdsInAndDateFrom(chatId, dateFrom);
        query.$and.push({guest: guestId});
        return await this.chatModel.update(query, {guestLastConnection: connectionDate}, {multi: true}).exec();
    }

    private buildQueryChatIdsInAndDateFrom(chatId: string, dateFrom: Date): any {
        return {
            $and: [{_id: chatId}, {menuDate: {$gte: dateFrom}}]
        }
    }
}
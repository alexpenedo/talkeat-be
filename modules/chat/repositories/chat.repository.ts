import {Injectable} from "injection-js";
import {BaseRepository} from "../../common/base.repository";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Message} from "../interfaces/message.interface";
import {Chat} from "../interfaces/chat.interface";

@Injectable()
export class ChatRepository extends BaseRepository<Chat> {
    constructor(@InjectModel('Chat') private readonly chatModel: Model<Chat>) {
        super(chatModel);
    }

    async findByBookingId(bookingId: string): Promise<Chat> {
        return await this.chatModel.findOne({booking: bookingId}).exec();
    }

    async pushChatMessage(id: string, message: Message): Promise<Chat> {
        return await this.chatModel.findByIdAndUpdate(id, {$push: {messages: message}}).exec();
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

    async updateHostConnectionDateByChatIds(chatIds: string[], hostId: string, dateFrom: Date, connectionDate: Date): Promise<Chat> {
        const query = this.buildQueryChatIdsInAndDateFrom(chatIds, dateFrom);
        query.$and.push({host: hostId});
        return await this.chatModel.update(query, {hostLastConnection: connectionDate}, {multi: true}).exec();
    }

    async updateGuestConnectionDateByChatIds(chatIds: string[], guestId: string, dateFrom: Date, connectionDate: Date): Promise<Chat> {
        const query = this.buildQueryChatIdsInAndDateFrom(chatIds, dateFrom);
        query.$and.push({guest: guestId});
        return await this.chatModel.update(query, {hostLastConnection: connectionDate}, {multi: true}).exec();
    }

    private buildQueryChatIdsInAndDateFrom(chatIds: string[], dateFrom: Date): any {
        return {
            $and: [{_id: {$in: chatIds}}, {menuDate: {$gte: dateFrom}}]
        }
    }
}
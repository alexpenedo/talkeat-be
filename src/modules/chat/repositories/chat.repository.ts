import {BaseRepository} from "../../../common/repositories/base.repository";
import {InjectModel} from "@nestjs/mongoose";
import {Message} from "../domain/message";
import {Chat} from "../domain/chat";
import {Injectable} from "@nestjs/common";
import {ChatAssembler} from "../assemblers/chat-assembler";

@Injectable()
export class ChatRepository extends BaseRepository<Chat> {
    constructor(@InjectModel('Chat') private readonly chatModel,
                private readonly chatAssembler: ChatAssembler) {
        super(chatModel, chatAssembler);
    }

    async findByBookingId(bookingId: string): Promise<Chat> {
        const document = await this.chatModel.findOne({booking: bookingId}).exec();
        return this.chatAssembler.toEntity(document);
    }

    async findByBookingIdIn(bookingIds: string[]): Promise<Chat[]> {
        const documents = await this.chatModel.find({booking: {$in: bookingIds}}).exec();
        return this.chatAssembler.toEntities(documents);
    }

    async pushChatMessage(id: string, message: Message): Promise<Chat> {
        await this.chatModel.findByIdAndUpdate(id, {$push: {messages: message}}).exec();
        return await this.findById(id);
    }

    async findByGuestIdOrHostIdAndDateFrom(hostId: string, guestId: string, dateFrom: Date): Promise<Chat[]> {
        const query = {
            $and: [{menuDate: {$gte: dateFrom}}, {$or: [{host: hostId}, {guest: guestId}]}]
        };
        const documents = await this.chatModel.find(query).populate('guest host')
            .populate({
                path: 'booking',
                model: 'Booking',
                populate: {
                    path: 'menu',
                    model: 'Menu'
                }
            }).exec();
        return this.chatAssembler.toEntities(documents);
    }

    async updateHostConnectionDateByChatId(chatId: string, hostId: string, dateFrom: Date, connectionDate: Date) {
        const query = this.buildQueryChatIdsInAndDateFrom(chatId, dateFrom);
        query.$and.push({host: hostId});
        await this.chatModel.update(query, {hostLastConnection: connectionDate}, {multi: true}).exec();
    }

    async updateGuestConnectionDateByChatId(chatId: string, guestId: string, dateFrom: Date, connectionDate: Date) {
        const query = this.buildQueryChatIdsInAndDateFrom(chatId, dateFrom);
        query.$and.push({guest: guestId});
        await this.chatModel.update(query, {guestLastConnection: connectionDate}, {multi: true}).exec();
    }

    private buildQueryChatIdsInAndDateFrom(chatId: string, dateFrom: Date): any {
        return {
            $and: [{_id: chatId}, {menuDate: {$gte: dateFrom}}]
        }
    }
}
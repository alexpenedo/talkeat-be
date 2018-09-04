import * as faker from 'faker';
import {Injectable} from "@nestjs/common";
import {Booking} from "../../src/modules/bookings/domain/booking";
import {BookingBuilder} from "./booking.builder";
import {Chat} from "../../src/modules/chat/domain/chat";
import {ChatRepository} from "../../src/modules/chat/repositories/chat.repository";
import {Message} from "../../src/modules/chat/domain/message";
import {MessageBuilder} from "./message.builder";
import {User} from "../../src/modules/users/domain/user";

@Injectable()
export class ChatBuilder {
    private readonly _chat: Chat;

    constructor(private chatRepository: ChatRepository,
                private bookingBuilder: BookingBuilder,
                private messageBuilder: MessageBuilder) {
        this._chat = new Chat();
    }

    withId(id: string): ChatBuilder {
        this._chat._id = id;
        return this;
    }

    withDate(date: any): ChatBuilder {
        this._chat.date = date;
        return this;
    }

    withBooking(booking: Booking): ChatBuilder {
        this._chat.booking = booking;
        return this;
    }


    withMessages(messages: Message[]): ChatBuilder {
        this._chat.messages = messages;
        return this;
    }

    withHostLastConnection(hostLastConnection: Date): ChatBuilder {
        this._chat.hostLastConnection = hostLastConnection;
        return this;
    }

    withGuestLastConnection(guestLastConnection: Date): ChatBuilder {
        this._chat.guestLastConnection = guestLastConnection;
        return this;
    }

    withDeleted(deleted: boolean): ChatBuilder {
        this._chat.deleted = deleted;
        return this;
    }

    withValidData(): ChatBuilder {
        const hostLastConnection = faker.date.recent(1);
        const guestLastConnection = faker.date.recent(1);
        return this.withHostLastConnection(hostLastConnection)
            .withGuestLastConnection(guestLastConnection)
            .withDeleted(false);
    }

    async build(booking?: Booking, messages?: Message[]) {
        booking ? this.withBooking(booking) :
            this.withBooking(await this.bookingBuilder.withValidData().store());
        messages ? this.withMessages(messages) :
            this.withMessages(this.generateMessages(this._chat.booking.menu.host, this._chat.booking.guest));
        return this._chat;
    }

    async store(booking?: Booking, messages?: Message[]): Promise<Chat> {
        booking ? this.withBooking(booking) :
            this.withBooking(await this.bookingBuilder.withValidData().store());
        messages ? this.withMessages(messages) :
            this.withMessages(this.generateMessages(this._chat.booking.menu.host, this._chat.booking.guest));
        return await this.chatRepository.save(this._chat);
    }

    private generateMessages(host: User, guest: User): Message[] {
        const messages = [];
        const numberOfMessages = faker.random.number({min: 1, max: 200});
        for (let i = 0; i < numberOfMessages; i++) {
            messages.push(this.messageBuilder.withValidData().build((i % 2 == 0) ? guest : host));
        }
        return messages;
    }
}

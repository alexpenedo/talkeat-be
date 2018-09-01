import {Assembler} from "./abstract.assembler";
import {Injectable} from "@nestjs/common";
import {Chat} from "../../modules/chat/domain/chat";
import {Menu} from "../../modules/menus/domain/menu";
import {UserAssembler} from "./user-assembler";
import {BookingAssembler} from "./booking-assembler";

@Injectable()
export class ChatAssembler extends Assembler<Chat> {
    constructor(private readonly userAssembler: UserAssembler,
                private readonly bookingAssembler: BookingAssembler) {
        super();
    }

    toDocument(chat: Chat) {
        return {
            _id: chat._id ? chat._id : undefined,
            booking: this.bookingAssembler.toDocument(chat.booking),
            menuDate: chat.booking.menu.date,
            host: this.userAssembler.toDocument(chat.booking.menu.host),
            guest: this.userAssembler.toDocument(chat.booking.guest),
            messages: chat.messages,
            hostLastConnection: chat.hostLastConnection,
            guestLastConnection: chat.guestLastConnection,
            deleted: chat.deleted ? chat.deleted : false
        }
    }

    toEntity(document): Chat {
        const chat: Chat = new Chat();
        chat._id = document._id ? document._id.toString() : undefined;
        chat.booking = this.bookingAssembler.toEntity(document.booking);
        chat.booking.guest = this.userAssembler.toEntity(document.guest);
        chat.booking.menu = new Menu();
        chat.booking.menu._id = document.booking.menu.toString();
        chat.booking.menu.host = this.userAssembler.toEntity(document.host);
        chat.booking.menu.date = document.menuDate;
        chat.date = document.date;
        chat.messages = document.messages;
        chat.hostLastConnection = document.hostLastConnection;
        chat.guestLastConnection = document.guestLastConnection;
        chat.deleted = document.deleted;
        return chat;
    }

}
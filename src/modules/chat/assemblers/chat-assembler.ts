import {Assembler} from "../../../common/assemblers/abstract.assembler";
import {Injectable} from "@nestjs/common";
import {Chat} from "../domain/chat";
import {Menu} from "../../menus/domain/menu";

@Injectable()
export class ChatAssembler extends Assembler<Chat> {
    toDocument(chat: Chat) {
        return {
            _id: chat._id ? chat._id : undefined,
            booking: chat.booking,
            menuDate: chat.booking.menu.date,
            host: chat.booking.menu.host,
            guest: chat.booking.guest,
            messages: chat.messages,
            hostLastConnection: chat.hostLastConnection,
            guestLastConnection: chat.guestLastConnection,
            deleted: chat.deleted ? chat.deleted : false
        }
    }

    toEntity(document): Chat {
        const chat: Chat = new Chat();
        chat._id = document._id ? document._id : undefined;
        chat.booking = document.booking;
        chat.booking.guest = document.guest;
        chat.booking.menu = new Menu();
        chat.booking.menu.host = document.host;
        chat.booking.menu.date = document.menuDate;
        chat.date = document.date;
        chat.messages = document.messages;
        chat.hostLastConnection = document.hostLastConnection;
        chat.guestLastConnection = document.guestLastConnection;
        chat.deleted = document.deleted;
        return chat;
    }

}
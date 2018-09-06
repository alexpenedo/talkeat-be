import {Assembler} from "./abstract.assembler";
import {Injectable} from "@nestjs/common";
import {UserAssembler} from "./user-assembler";
import {Message} from "../../modules/chat/domain/message";

@Injectable()
export class MessageAssembler extends Assembler<Message> {
    constructor(private readonly userAssembler: UserAssembler) {
        super();
    }

    toEntity(document): Message {
        const message: Message = new Message();
        message._id = document._id ? document._id.toString() : undefined;
        message.date = document.date;
        message.from = message.from ? this.userAssembler.toEntity(document.from) : undefined;
        message.message = document.message;
        return message;
    }

    toDocument(entity) {
        return entity;
    }
}
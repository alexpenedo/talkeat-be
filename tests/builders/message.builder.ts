import * as faker from 'faker';
import {Injectable} from "@nestjs/common";
import {Message} from "../../src/modules/chat/domain/message";
import {User} from "../../src/modules/users/domain/user";

@Injectable()
export class MessageBuilder {
    private readonly _message: Message;

    constructor() {
        this._message = new Message();
    }

    withId(id: string): MessageBuilder {
        this._message._id = id;
        return this;
    }

    withDate(date: any): MessageBuilder {
        this._message.date = date;
        return this;
    }

    withMessage(message: string): MessageBuilder {
        this._message.message = message;
        return this;
    }

    withFrom(from: User): MessageBuilder {
        this._message.from = from;
        return this;
    }

    withValidData(): MessageBuilder {
        const date = faker.date.recent(1);
        const message = faker.lorem.paragraph();
        return this.withDate(date)
            .withMessage(message);
    }

    build(from: User) {
        this.withFrom(from);
        return this._message;
    }
}

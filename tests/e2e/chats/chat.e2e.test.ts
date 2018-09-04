import * as request from 'supertest';
import {Response} from 'supertest';
import * as _ from 'lodash';
import TestRunner from "../../utils/test-runner";
import {Chat} from "../../../src/modules/chat/domain/chat";
import {clearDatabase, getToken} from "../../utils/test-utils";
import {chatBuilder} from "../../utils/test-builders";

describe('Chat Controller Test', async () => {
    let server;
    beforeEach(async (done) => {
        server = await TestRunner.run();
        done();
    });
    afterEach(async (done) => {
        await clearDatabase();
        await server.close();
        done();
    });

    it(`/GET chats: should get user chats`, async () => {
        const chat: Chat = await chatBuilder().withValidData().store();
        const token = await getToken(chat.booking.guest);
        const response: Response = await request(server)
            .get('/chats')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        const chats = response.body as Chat[];
        expect(chats.length).toBe(1);
        expect(_.first(chats).messages.length).toBe(chat.messages.length);
    });
});

import * as io from 'socket.io-client';
import TestRunner from "../../utils/test-runner";
import {Chat} from "../../../src/modules/chat/domain/chat";
import * as _ from 'lodash';
import * as faker from 'faker';
import {Notification} from "../../../src/common/enums/notification.enum";
import * as request from "supertest";
import {Response} from "supertest";
import {bookingBuilder, chatBuilder} from "../../utils/test-builders";
import {clearDatabase, getToken} from "../../utils/test-utils";

describe('Chat Gateway Test', async () => {
    let server;
    let config;
    let socketUrl;
    beforeEach(async (done) => {
        server = await TestRunner.run();
        config = TestRunner.config;
        socketUrl = `http://localhost:${config.port}`;
        done();
    });
    afterEach(async (done) => {
        await clearDatabase();
        await server.close();
        done();
    });
    it(`should handle firstMessage and create chat`, async () => {
        const booking = await bookingBuilder().withValidData().store();
        let socket = io.connect(socketUrl, {
            query: {token: await getToken(booking.guest)}
        });
        socket.emit('firstMessage', booking);
        await new Promise(resolve => {
            socket.on('newChat', (chat: Chat) => {
                expect(chat.booking._id).toBe(booking._id);
                resolve();
            });
        });
    });

    it(`should handle message`, async () => {
        const chat = await chatBuilder().withValidData().store();
        let socket = io.connect(socketUrl, {
            query: {token: await getToken(chat.booking.guest)}
        });
        const message = {
            chat,
            from: chat.booking.guest._id,
            message: faker.lorem.paragraph(),
            date: new Date()
        };
        socket.emit('message', message);
        await new Promise(resolve => {
            socket.on('message', (data: Chat) => {
                expect(_.last(data.messages).message).toBe(message.message);
                resolve();
            });
        });
    });


    it(`should send notification message on update menu`, async () => {
        const chat = await chatBuilder().withValidData().store();

        let socket = io.connect(socketUrl, {
            query: {token: await getToken(chat.booking.guest)}
        });

        const notification = {
            menu: chat.booking.menu,
            notification: Notification.UPDATE
        };
        socket.emit('notification', notification);
        await new Promise(resolve => {
            socket.on('message', (data: Chat) => {
                expect(_.last(data.messages).message).toBe('Menu updated by host. Please, check the changes');
                resolve();
            });
        });
    });


    it(`should send notification message on cancel menu`, async () => {
        const chat = await chatBuilder().withValidData().store();

        let socket = io.connect(socketUrl, {
            query: {token: await getToken(chat.booking.guest)}
        });

        const notification = {
            menu: chat.booking.menu,
            notification: Notification.CANCEL
        };
        socket.emit('notification', notification);
        await new Promise(resolve => {
            socket.on('message', (data: Chat) => {
                expect(_.last(data.messages).message).toBe('Menu canceled by host. Sorry.');
                resolve();
            });
        });
    });

    it(`should send booking state change on confirm booking`, async () => {
        const chat = await chatBuilder().withValidData().store();

        let socket = io.connect(socketUrl, {
            query: {token: await getToken(chat.booking.guest)}
        });

        socket.emit('changeBookingState', chat.booking);
        await new Promise(resolve => {
            socket.on('changeBookingState', (data: Chat) => {
                expect(data._id).toBe(chat._id);
                resolve();
            });
        });
    });

    it(`should update connectionDates on close chat`, async () => {
        const chat = await chatBuilder().withValidData().store();
        const token = await getToken(chat.booking.guest);
        let socket = io.connect(socketUrl, {
            query: {token: token}
        });

        const responseBefore: Response = await request(server)
            .get('/chats')
            .set('Authorization', `Bearer ${token}`);
        const chatBefore = _.first(responseBefore.body) as Chat;

        socket.emit('closeChat', chat);
        await new Promise(resolve => {
            setTimeout(async () => {
                const responseAfter: Response = await request(server)
                    .get('/chats')
                    .set('Authorization', `Bearer ${token}`);
                const chatAfter = _.first(responseAfter.body) as Chat;
                expect(new Date(chatBefore.guestLastConnection).getTime()).toBeLessThan(new Date(chatAfter.guestLastConnection).getTime());
                resolve();
            }, 1000);
        });
    });
});


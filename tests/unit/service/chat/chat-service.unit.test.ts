import {Test} from "@nestjs/testing";
import {UserBuilder} from "../../../builders/user.builder";
import {ChatRepository} from "../../../../src/modules/chat/repositories/chat.repository";
import {BookingService} from "../../../../src/modules/bookings/booking.service";
import {ChatService} from "../../../../src/modules/chat/chat.service";
import {BookingBuilder} from "../../../builders/booking.builder";
import {MenuBuilder} from "../../../builders/menu.builder";
import {UserRepository} from "../../../../src/modules/users/repositories/user.repository";
import * as faker from 'faker';
import {ConfigService} from "../../../../src/modules/infrastructure/config/config.service";
import {BookingRepository} from "../../../../src/modules/bookings/repositories/booking.repository";
import {MenuRepository} from "../../../../src/modules/menus/repositories/menu.repository";
import {ChatBuilder} from "../../../builders/chat.builder";
import {MessageBuilder} from "../../../builders/message.builder";
import * as _ from 'lodash';
import {NotFoundException} from "@nestjs/common";

describe('ChatService Unit tests', () => {
    let chatService: ChatService;
    let chatRepository: ChatRepository;
    let bookingService: BookingService;
    let bookingBuilder: BookingBuilder;
    let menuBuilder: MenuBuilder;
    let userBuilder: UserBuilder;
    let chatBuilder: ChatBuilder;
    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [ChatService, ChatBuilder, BookingBuilder, MessageBuilder, UserBuilder, MenuBuilder, {
                provide: ChatRepository,
                useValue: new ChatRepository(undefined, undefined)
            }, {
                provide: BookingRepository,
                useValue: new BookingRepository(undefined, undefined)
            }, {
                provide: BookingService,
                useValue: new BookingService(undefined, undefined)
            }, {
                provide: UserRepository,
                useValue: new UserRepository(undefined, undefined)
            }, {
                provide: MenuRepository,
                useValue: new MenuRepository(undefined, undefined)
            }, {
                provide: ConfigService,
                useValue: new ConfigService(`env/test.env`)
            }],
        }).compile();
        chatService = module.get<ChatService>(ChatService);
        chatRepository = module.get<ChatRepository>(ChatRepository);
        bookingService = module.get<BookingService>(BookingService);
        bookingBuilder = module.get<BookingBuilder>(BookingBuilder);
        menuBuilder = module.get<MenuBuilder>(MenuBuilder);
        userBuilder = module.get<UserBuilder>(UserBuilder);
        chatBuilder = module.get<ChatBuilder>(ChatBuilder);
    });

    describe('create', () => {
        it('should create a chat', async () => {
            const guest = userBuilder.withValidData().build();
            const host = userBuilder.withValidData().build();
            const booking = await bookingBuilder.withValidData().withId(faker.random.uuid()).build(guest, await menuBuilder.withValidData().build(host));
            jest.spyOn(chatRepository, 'save').mockImplementation((chat) => chat);
            const chat = await chatService.create(booking);
            expect(chat.messages.length).toBe(1);
            expect(chat.booking._id).toBe(booking._id);
        });
    });
    describe('findById', () => {
        it('should find chat by id', async () => {
            const guest = userBuilder.withValidData().build();
            const host = userBuilder.withValidData().build();
            const booking = await bookingBuilder.withValidData()
                .build(guest, await menuBuilder.withValidData().build(host));
            const chat = await chatBuilder.withValidData().build(booking);
            jest.spyOn(chatRepository, 'findById').mockImplementation(() => chat);
            expect(await chatService.findById('id')).toBe(chat);
        });
        it('should throw NotFoundException', async () => {
            jest.spyOn(chatRepository, 'findById').mockImplementation(() => null);
            try {
                await chatService.findById('id')
            } catch (e) {
                expect(e).toBeInstanceOf(NotFoundException);
            }
        });
    });


    describe('getBookingChat', () => {
        it('should get booking chat', async () => {
            const guest = userBuilder.withValidData().build();
            const host = userBuilder.withValidData().build();
            const booking = await bookingBuilder.withValidData().build(guest,
                await menuBuilder.withValidData().build(host));
            const chat = await chatBuilder.withValidData().build(booking);
            jest.spyOn(bookingService, 'findById').mockImplementation(() => booking);
            jest.spyOn(chatRepository, 'findByBookingId').mockImplementation(() => chat);
            const bookingChat = await chatService.getBookingChat(booking._id);
            expect(bookingChat.messages.length).toBe(chat.messages.length);
            expect(chat.booking._id).toBe(booking._id);
        });
    });

    describe('pushMessageOnChat', () => {
        it('should push new message on chat', async () => {
            const guest = userBuilder.withValidData().build();
            const host = userBuilder.withValidData().build();
            const booking = await bookingBuilder.withValidData().withId(faker.random.uuid())
                .build(guest, await menuBuilder.withValidData().build(host));
            const chat = await chatBuilder.withValidData().build(booking);
            jest.spyOn(chatRepository, 'findById').mockImplementation(() => chat);
            jest.spyOn(chatRepository, 'pushChatMessage').mockImplementation((chatId, message) => {
                chat.messages.push(message);
                return chat;
            });
            const chatWithNewMessage = await chatService.pushMessageOnChat(chat._id, 'message', undefined, guest);
            expect(_.last(chatWithNewMessage.messages).message).toBe('message');
        });
    });
    describe('saveChatMessagesOnNotificationMenu', () => {
        it('should save new messages on menu chats', async () => {
            const menu = await menuBuilder.withValidData().withId(faker.random.uuid()).build(userBuilder.withValidData().build());
            const booking = await bookingBuilder.withValidData().withId(faker.random.uuid())
                .build(userBuilder.withValidData().build(), menu);
            const booking2 = await bookingBuilder.withValidData().withId(faker.random.uuid())
                .build(userBuilder.withValidData().build(), menu);
            const chat = await chatBuilder.withValidData().withId('1').build(booking);
            const chat2 = await chatBuilder.withValidData().withId('2').build(booking2);
            jest.spyOn(chatRepository, 'findById').mockImplementation((id) => id === '1' ? chat : chat2);
            jest.spyOn(bookingService, 'findByMenuId').mockImplementation(() => [booking, booking2]);
            jest.spyOn(chatRepository, 'findByBookingIdIn').mockImplementation(() => [chat, chat2]);
            jest.spyOn(chatRepository, 'pushChatMessage').mockImplementation((id, message) => {
                id === '1' ? chat.messages.push(message) : chat2.messages.push(message);
            });
            const chats = await chatService.saveChatMessagesOnNotificationMenu(menu._id, 'content');
            expect(_.last(_.first(chats).messages).message).toBe('content');
            expect(_.last(_.last(chats).messages).message).toBe('content');
        });
    });


});
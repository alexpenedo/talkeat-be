import TestRunner from "./test-runner";
import {UserBuilder} from "../builders/user.builder";
import {MenuBuilder} from "../builders/menu.builder";
import {BookingBuilder} from "../builders/booking.builder";
import {RateBuilder} from "../builders/rate.builder";
import {ChatBuilder} from "../builders/chat.builder";
import {MessageBuilder} from "../builders/message.builder";

export const userBuilder = () => TestRunner.testingModule().get<UserBuilder>(UserBuilder);

export const menuBuilder = () => TestRunner.testingModule().get<MenuBuilder>(MenuBuilder);

export const bookingBuilder = () => TestRunner.testingModule().get<BookingBuilder>(BookingBuilder);

export const rateBuilder = () => TestRunner.testingModule().get<RateBuilder>(RateBuilder);

export const chatBuilder = () => TestRunner.testingModule().get<ChatBuilder>(ChatBuilder);

export const messageBuilder = () => TestRunner.testingModule().get<MessageBuilder>(MessageBuilder);

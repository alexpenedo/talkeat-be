import * as socketIo from 'socket.io';
import {server} from "../lib/server";
import {Booking} from "../models/booking";
import chatController from '../controllers/chat'

export class SocketConfiguration {

    static configure(): void {
        const io: SocketIO.Server = socketIo(server);
        io.on('connection', (socket) => {
            socket.on('online', (user) => {
                console.log('me uno a ' + user._id);
                socket.join(user._id);
            });

            socket.on('message', (m) => {
                chatController.pushMessageOnChat(m.chat, m.message, m.from).then(chat => {
                    m.chat.messages.push({
                        message: m.message,
                        from: m.from
                    });
                    io.sockets.in(chat.host).emit('message', m);
                    io.sockets.in(chat.guest).emit('message', m);
                });
            });
            socket.on('notification', (menu) => {
                Booking.find({menu: menu._id}).exec()
                    .then(bookings => {
                        bookings.forEach((booking) => {
                            chatController.findByBookingId(booking._id).then(chat => {
                                const content = 'Menu updated by host. Please, check the changes';
                                chatController.pushMessageOnChat(chat._id, content).then(chat => {
                                    io.sockets.in(booking.guest).emit('message', chat.messages[chat.messages.length - 1]);
                                });
                            });
                        }).catch();
                    });
            });

            socket.on('firstMessage', (b) => {
                chatController.createFirstMessageByBooking(b).then(chat => {
                    io.sockets.in(chat.host._id).emit('newChat', chat);
                    io.sockets.in(chat.guest._id).emit('newChat', chat);
                });
            });
            socket.on('closeChat', (c) => {
                chatController.updateUserConnectionDates(socket.rooms[0], [c._id]);
            });
            socket.on('minimizeChat', (c) => {
                chatController.updateUserConnectionDates(socket.rooms[0], [c._id]);
            });
            socket.on('disconnect', () => {
                console.log('Client disconnected');
            });
        });

    }
}

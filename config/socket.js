import app from "./express";
import chatController from "../controllers/chat";
import http from 'http';
import SocketIO from "socket.io";

const server = http.Server(app);
let io = new SocketIO(server);

io.on('connection', (socket) => {
    socket.on('online', (user) => {
        console.log('me uno a ' + user._id);
        socket.join(user._id);
        socket.user = user;
    });

    socket.on('message', (m) => {
        chatController.pushMessageOnChat(m.chat, m.from, m.message).then(chat => {
            m.chat.messages.push({
                message: m.message,
                from: m.from
            });
            io.sockets.in(chat.host).emit('message', m);
            io.sockets.in(chat.guest).emit('message', m);
        });
    });
    socket.on('firstMessage', (b) => {
        chatController.createFirstMessageByBooking(b).then(chat => {
            io.sockets.in(chat.host._id).emit('newChat', chat);
            io.sockets.in(chat.guest._id).emit('newChat', chat);
        });
    });
    socket.on('closeChat', (c) => {
        chatController.updateUserConnectionDates(socket.user, [c._id]);
    });
    socket.on('minimizeChat', (c) => {
        chatController.updateUserConnectionDates(socket.user, [c._id]);
    });
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });

});

export default server;

import app from "./express";
import chatController from "../controllers/chat";
import http from 'http';
import SocketIO from "socket.io";

const server = http.Server(app);
let io = new SocketIO(server);

io.on('connection', (socket) => {
    socket.on('online', (user) => {
        socket.user = user;
    });

    socket.on('chatsOpened', (chats) => {
        socket.chats = chats;
    });

    socket.on('message', (m) => {
        chatController.pushMessageOnChat(m.chat, m.from, m.message);
        m.chat.messages.push({
            message: m.message,
            from: m.from
        });
        io.sockets.emit('message', m);
    });
    socket.on('firstMessage', (b) => {
        chatController.createFirstMessageByBooking(b).then(chat => {
            io.sockets.emit('newChat', chat);
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

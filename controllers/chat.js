import Booking from '../models/booking';
import Menu from '../models/menu/menu';
import httpStatus from 'http-status';
import APIError from '../utils/APIError';
import config from '../config/config';
import assert from 'assert';
import Chat from '../models/chat/chat';
import Message from '../models/chat/message';



function createFirstMessageByBooking(booking) {
    let message = {
        date: new Date(),
        message: "I would like to book this menu",
        from: booking.guest
    }
    let chat = new Chat({
        booking,
        menuDate: booking.menuDate,
        host: booking.host,
        guest: booking.guest,
        messages: [message]
    })
    chat.save();
}

function pushMessageOnChat(id, user, content) {

    let message = {
        date: new Date(),
        message: content,
        from: user
    }
    Chat.findByIdAndUpdate(id, { $push: { messages: message } })
        .exec();
}


/**
 * Get chats by hostId or guestId
 * @returns {Chat}
 */
function findByGuestIdOrHostId(req, res, next) {
    let hostId = req.query.hostId;
    let guestId = req.query.guestId;
    let query = {
        $or: [{ host: hostId },
        { guest: guestId }]
    }
    Chat.find(query)
        .populate('guest host')
        .exec()
        .then(chats => {
            res.status(httpStatus.OK).send(chats);
        }).catch(e => next(e));
}


export default { createFirstMessageByBooking, findByGuestIdOrHostId, pushMessageOnChat }
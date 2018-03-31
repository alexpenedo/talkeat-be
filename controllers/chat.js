import Booking from '../models/booking';
import Menu from '../models/menu/menu';
import httpStatus from 'http-status';
import APIError from '../utils/APIError';
import config from '../config/config';
import assert from 'assert';
import Chat from '../models/chat/chat';
import Message from '../models/chat/message';



function createFirstMessageByBooking(booking) {
    let date = new Date();
    let message = {
        date: date,
        message: "I would like to book this menu",
        from: booking.guest
    }

    let chat = new Chat({
        booking,
        menuDate: booking.menuDate,
        host: booking.host,
        guest: booking.guest,
        messages: [message],
        hostLastConnection: date,
        guestLastConnection: date
    })
    return chat.save().then(chat => {
        return Chat.findById(chat._id).populate('guest host').exec();
    });

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

function updateUserConnectionDates(user, chatIds) {
    let date = new Date();
    let queryHost = {
        $and: [
            {
                _id: {
                    $in: chatIds
                }

            }, {
                menuDate: {
                    $gte: new Date()
                }
            },
            { host: user._id }
        ]
    }
    let queryGuest = {
        $and: [
            {
                _id: {
                    $in: [
                        chatIds
                    ]
                }

            }, {
                menuDate: {
                    $gte: new Date()
                }
            },
            { guest: user._id }
        ]
    }
    Chat.update(queryHost, { hostLastConnection: date }, { multi: true }).exec();
    Chat.update(queryGuest, { guestLastConnection: date }, { multi: true }).exec();
}


/**
 * Get chats by hostId or guestId
 * @returns {Chat}
 */
function findByGuestIdOrHostId(req, res, next) {
    let hostId = req.query.hostId;
    let guestId = req.query.guestId;
    let query = {
        $and: [{
            menuDate: {
                $gte: new Date()
            }
        }, {
            $or: [{ host: hostId },
            { guest: guestId }]
        }]
    }
    Chat.find(query)
        .populate('guest host')
        .exec()
        .then(chats => {
            res.status(httpStatus.OK).send(chats);
        }).catch(e => next(e));
}


export default { createFirstMessageByBooking, findByGuestIdOrHostId, pushMessageOnChat, updateUserConnectionDates }
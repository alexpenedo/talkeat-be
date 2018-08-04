import Booking from '../models/booking';
import Menu from '../models/menu/menu';
import httpStatus from 'http-status';
import Chat from '../models/chat/chat';


function createFirstMessageByBooking(booking) {
    let date = new Date();
    const message = {
        date: date,
        message: "I would like to book this menus",
        from: booking.guest
    };

    const chat = new Chat({
        booking,
        menuDate: booking.menuDate,
        host: booking.host,
        guest: booking.guest,
        messages: [message],
        hostLastConnection: date,
        guestLastConnection: date
    });

    return chat.save().then(chat => {
        return ChatRepository.findById(chat._id).populate('guest host')
            .populate({
                path: 'booking',
                model: 'Booking',
                populate: {
                    path: 'menu',
                    model: 'Menu'
                }
            }).exec();
    });

}

function findByBookingId(bookingId) {
    return Chat.findOne({booking: bookingId}).exec();
}

function pushMessageOnChat(id, content, user) {
    let message = {
        date: new Date(),
        message: content
    };
    if (user) {
        message.from = user;
    }
    return Chat.findByIdAndUpdate(id, {$push: {messages: message}}).exec();
}

function wa(user, chatIds) {
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
            {host: user._id}
        ]
    };
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
            {guest: user._id}
        ]
    }
    Chat.update(queryHost, {hostLastConnection: date}, {multi: true}).exec();
    Chat.update(queryGuest, {guestLastConnection: date}, {multi: true}).exec();
}


function(req, res, next) {
    let hostId = req.query.hostId;
    let guestId = req.query.guestId;
    let query = {
        $and: [{
            menuDate: {
                $gte: new Date()
            }
        }, {
            $or: [{host: hostId},
                {guest: guestId}]
        }]
    };
    Chat.find(query).populate('guest host')
        .populate({
            path: 'booking',
            model: 'Booking',
            populate: {
                path: 'menu',
                model: 'Menu'
            }
        }).exec()
        .then(chats => {
            res.status(httpStatus.OK).send(chats);
        }).catch(e => next(e));
}

function deleteChat(req, res, next) {
    const booking = req.body;
    booking.confirmed = true;
    booking.save().then(booking => {
        res.status(200).send(booking);
    }).catch(e => next(e))
}


export default {
    createFirstMessageByBooking,
    findByGuestIdOrHostId,
    pushMessageOnChat,
    updateUserConnectionDates,
    findByBookingId
}
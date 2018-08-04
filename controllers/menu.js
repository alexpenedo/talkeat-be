import Menu from '../models/menu/menu';
import Booking from '../models/booking';
import httpStatus from 'http-status';
import _ from 'lodash';

function load(req, res, next, id) {
    Menu.get(id)
        .then((menu) => {
            req.menu = menu;
            return next();
        })
        .catch(e => next(e));
}

function create(req, res, next) {
    let menu = new Menu(req.body);
    menu.save().then(menu => {
        res.status(200).send(menu);
    }).catch(e => next(e));
}

function update(req, res, next) {
    let menu = req.menu;
    Object.assign(menu, req.body);
    console.log(menu);
    menu.save().then(menu => {
        res.status(httpStatus.OK).send(menu)
    }).catch(e => next(e));
}

function get(req, res) {
    return res.json(req.menu);
}

function find(req, res, next) {
    if (req.query.host) {
        findHostMenus(req, res, next);
    } else {
        findUserMenus(req, res, next);
    }
}

function findUserMenus(req, res, next) {
    let coords = [];
    coords[0] = req.query.longitude;
    coords[1] = req.query.latitude;
    let persons = req.query.persons;
    let date = req.query.date;
    let type = req.query.type;
    let userId = req.query.user;
    let maxDistance = 10 / 111.12;
    Booking.find({
        guest: userId,
        menuDate: {
            $gte: new Date()
        }
    }).exec().then(bookings => {
        const menus = _.map(bookings, 'menu');
        Menu.find({
            _id: {
                $nin: menus
            },
            location: {
                $near: coords,
                $maxDistance: maxDistance
            },
            available: {
                $gte: persons
            },
            date: {
                $gte: getStartDate(date, type),
                $lte: getEndDate(date, type)
            },
            host: {
                $ne: userId
            }
        }).exec()
            .then(menus => {
                res.status(httpStatus.OK).send(menus);
            }).catch(e => next(e));
    });

}

function findHostMenus(req, res, next) {
    let dateFrom = req.query.dateFrom;
    let dateTo = req.query.dateTo;
    let query = {};
    query.host = req.query.host;
    if (dateFrom !== undefined) {
        dateFrom = new Date(dateFrom);
        console.log(dateFrom);
        query.date = {
            $gte: dateFrom
        };
    }
    if (dateTo !== undefined) {
        dateTo = new Date(dateTo);
        query.date = {
            $lte: dateTo
        };
    }
    Menu.find(query).sort({date: 1}).exec()
        .then(menus => {
            res.status(httpStatus.OK).send(menus);
        }).catch(e => next(e));

}

function getEndDate(date, type) {
    let end = new Date(date);
    if (type === 'dinner') {
        end.setHours(23);
        end.setMinutes(59);
    }
    else {
        end.setHours(17);
        end.setMinutes(59);
    }
    return end;
}

function getStartDate(date, type) {
    let start = new Date(date);
    if (type === 'dinner') {
        start.setHours(18);
        start.setMinutes(0);
    }
    else {
        start.setHours(12);
        start.setMinutes(0);
    }
    return start;
}


export default {create, find, get, load, update}
import Menu from '../models/menu/menu';
import httpStatus from 'http-status';
import APIError from '../utils/APIError';
import config from '../config/config';
import assert from 'assert';

/**
 * Load menu and append to req.
 */
function load(req, res, next, id) {
    Menu.get(id)
        .then((menu) => {
            req.menu = menu;
            return next();
        })
        .catch(e => next(e));
}

/**
 * Create new menu
 * @property {string} req.body.name - The name of menu.
 * @property {string} req.body.description - The description of menu.
 * @property {array} req.body.starters - The array of starters.
 * @property {array} req.body.mains - The array of mains.
 * @property {array} req.body.desserts - The array of desserts.
 * @property {array} req.body.guests - The number of giests.
 * @property {number} req.body.price - The price of menu.
 * @property {User} req.body.host - The host of menu .
 * @property {User} req.body.address - The address of menu .
 * @property {User} req.body.postalCode - The postalCode of menu .
 * @property {User} req.body.country - The country of menu .
 * @returns {Menu}
 */
function create(req, res, next) {
    let menu = new Menu(req.body);
    menu.save().then(menu => {
        res.status(200).send(menu)
    }).catch(e => next(e));
}

/**
 * Edit menu
 * @property {string} req.body.name - The name of menu.
 * @property {string} req.body.description - The description of menu.
 * @property {array} req.body.starters - The array of starters.
 * @property {array} req.body.mains - The array of mains.
 * @property {array} req.body.desserts - The array of desserts.
 * @property {number} req.body.guests - The number of giests.
 * @property {number} req.body.price - The price of menu.
 * @property {User} req.body.host - The host of menu .
 * @returns {Menu}
 */
function update(req, res, next) {
    let menu = req.menu;
    Object.assign(menu, req.body);
    menu.save().then(menu => {
        res.status(200).send(menu)
    }).catch(e => next(e));
}

/**
 * Get Menu
 * @returns {Menu}
 */
function get(req, res) {
    return res.json(req.menu);
}

/**
 * Get Menus
 * @returns {Menu}
 */
function find(req, res, next) {
    let postalCode = req.query.postalCode;
    let persons = req.query.persons;
    let date = req.query.date;
    let type = req.query.type;

    Menu.find({
        postalCode,
        available: {
            $gte: persons
        },
        date: {
            $gte: getStartDate(date, type),
            $lte: getEndDate(date, type)
        }
    }).exec()
        .then(menus => {
            console.log(menus);
            res.status(200).send(menus);
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


export default { create, find, get, load, update }
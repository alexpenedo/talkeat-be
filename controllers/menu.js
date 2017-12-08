
import { Menu } from '../models/menu/menu';
import httpStatus from 'http-status';
import APIError from '../utils/APIError';
import config from '../config/config';
import assert from 'assert';

/**
 * Load menuTemplate and append to req.
 */
function load(req, res, next, id) {
    MenuTemplate.get(id)
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
    menuTemplate.save().then(menu => {
        res.status(200).send(menu)
    }).catch(e => next(e));
}

/**
 * Get MenuTemplate
 * @returns {Menu}
 */
function get(req, res) {
    return res.json(req.menu);
}


export default { create, get, load, update }
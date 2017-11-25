
import MenuTemplate from '../models/menu/menuTemplate';
import httpStatus from 'http-status';
import APIError from '../utils/APIError';
import config from '../config/config';
import assert from 'assert';

/**
 * Load menuTemplate and append to req.
 */
function load(req, res, next, id) {
    MenuTemplate.get(id)
        .then((menuTemplate) => {
            req.menuTemplate = menuTemplate;
            return next();
        })
        .catch(e => next(e));
}

/**
 * Create new menuTemplate
 * @property {string} req.body.name - The name of menu.
 * @property {string} req.body.description - The description of menu.
 * @property {array} req.body.starters - The array of starters.
 * @property {array} req.body.mains - The array of mains.
 * @property {array} req.body.desserts - The array of desserts.
 * @property {array} req.body.guests - The number of giests.
 * @property {number} req.body.price - The price of menu.
 * @property {User} req.body.host - The host of menu .
 * @returns {MenuTemplate}
 */
function create(req, res, next) {
    let menuTemplate = new MenuTemplate(req.body);
    menuTemplate.save().then(menuTemplate => {
        res.status(200).send(menuTemplate)
    }).catch(e => next(e));
}

/**
 * Edit menuTemplate
 * @property {string} req.body.name - The name of menu.
 * @property {string} req.body.description - The description of menu.
 * @property {array} req.body.starters - The array of starters.
 * @property {array} req.body.mains - The array of mains.
 * @property {array} req.body.desserts - The array of desserts.
 * @property {array} req.body.guests - The number of giests.
 * @property {number} req.body.price - The price of menu.
 * @property {User} req.body.host - The host of menu .
 * @returns {MenuTemplate}
 */
function update(req, res, next) {
    let menuTemplate = req.menuTemplate;
    Object.assign(menuTemplate, req.body);
    menuTemplate.save().then(menuTemplate => {
        res.status(200).send(menuTemplate)
    }).catch(e => next(e));
}

/**
 * Get MenuTemplate
 * @returns {MenuTemplate}
 */
function get(req, res) {
    return res.json(req.menuTemplate);
}


export default { create, get, load, update }

import User from '../models/user';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import APIError from '../utils/APIError';
import config from '../config/config';
import bcrypt from 'bcrypt-nodejs';
import assert from 'assert';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

/**
 * Create new user
 * @property {string} req.body.name - The name of user.
 * @property {string} req.body.surname - The surname of user.
 * @property {string} req.body.email - The email of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @property {string} req.body.password - The password of user.
 * @property {string} req.body.postalCode - The postalCode of user.
 * @property {string} req.body.address - The address of user.
 * @property {string} req.body.country - The country of user.
 * @returns {User}
 */
function create(req, res, next) {
    let user = new User(req.body);
    user.password = bcrypt.hashSync(user.password);
    user.save().then(userStored => {
        const token = jwt.sign({
            email: user.email
        }, config.jwtSecret);
        res.status(200).send({
            user: userStored,
            token
        })
    }).catch(e => next(e));
}
/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function login(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email }).exec().then(user => {
        assert.ok(bcrypt.compareSync(password, user.password));
        const token = jwt.sign({
            email: user.email
        }, config.jwtSecret);
        return res.json({
            token,
            user
        });
    }).catch(e => {
        const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
        next(err);
    });
}

/**
 * Update user
 * @property {string} req.body._id - The id of user.
 * @property {string} req.body.name - The name of user.
 * @property {string} req.body.surname - The surname of user.
 * @property {string} req.body.email - The email of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @property {string} req.body.password - The password of user.
 * @property {string} req.body.postalCode - The postalCode of user.
 * @property {string} req.body.address - The address of user.
 * @property {string} req.body.country - The country of user.
 * @returns {User}
 */
function update(req, res, next) {
    User.get(req.params.userId)
        .then((user) => {
            Object.assign(user, req.body);
            user.save().then(user => {
                res.status(200).send(user);
            }).catch(e => next(e))
        })
        .catch(e => next(e));
}

function uploadPhoto(req, res, next) {
    User.findById(req.params.userId)
        .exec().then((user) => {
            let upload = multer({ dest: './uploads/' }).single('file');
            upload(req, res, function (err) {
                if (err) {
                    next(err);
                }
                if (user.picture != undefined) {
                    fs.unlink(user.picture, (err) => {
                        console.error(err);
                    });
                }
                user.picture = req.file.filename;
                user.save().then(user => {
                    res.status(200).send(user);
                }).catch(e => next(e));

            });
        })
        .catch(e => next(e));
}

function getPhoto(req, res, next) {
    let picture = req.query.id;
    res.sendFile(path.resolve('./uploads/' + picture));
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res, next) {
    const { limit = 50, skip = 0 } = req.query;
    User.list({ limit, skip })
        .then(users => res.json(users))
        .catch(e => next(e));
}


function getUsers(req, res) {
    User.find()
        .then(users => res.json(users))
        .catch(e => next(e));
}

/**
 * Get User
 * @returns {User}
 */
function get(req, res, next) {
    User.get(req.params.userId)
        .then((user) => {
            res.status(200).send(user);
        })
        .catch(e => next(e));
}


export default { get, create, login, getUsers, update, uploadPhoto, getPhoto }
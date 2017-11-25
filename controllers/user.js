
import User from '../models/user';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import APIError from '../utils/APIError';
import config from '../config/config';
import bcrypt from 'bcrypt-nodejs';
import assert from 'assert';

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
    const email = req.body.email.toLowerCase();
    const password = req.body.password;
    console.log(email);
    User.findOne({ email }).exec().then(user => {
        assert.ok(bcrypt.compareSync(password, user.password));
        const token = jwt.sign({
            email: user.email
        }, config.jwtSecret);
        return res.json({
            token,
            email: user.email
        });
    }).catch(e => {
        const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
        next(err);
    });
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

function load(req, res, next, id) {
    User.get(id)
        .then((user) => {
            req.user = user;
            return next();
        })
        .catch(e => next(e));
}

function updateUser(req, res) {
    var userId = req.params.id;
    var update = req.body;

    if (userId != req.user.sub) {
        return res.status(500).send({ message: 'Error al actualizar el usuario. No tienes permisos' });
    }
    User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
        if (!Utils.errorFoundAndResponse(res, err, userUpdated)) {
            res.status(200).send({ userUpdated });
        }
    });
}



function uploadImage(req, res) {
    var userId = req.params.id;
    var file_name = "No subido...";

    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split("\/");
        var file_name = file_split[2];
        var ext_split = file_name.split("\.");
        var file_ext = ext_split[1];

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
            User.findByIdAndUpdate(userId, { image: file_name }, (err, userUpdated) => {
                if (!Utils.errorFoundAndResponse(res, err, userUpdated)) {
                    res.status(200).send({ image: file_name, user: userUpdated });
                }
            });
        }
    }
    else {
        res.status(400).send({ message: 'No se ha subido ninguna imagen' });
    }
}


function getImageFile(req, res) {
    var imageFile = req.params.imageFile;
    var path_file = './uploads/users/' + imageFile;
    fs.exists(path_file, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(404).send({ message: 'No existe la imagen' });
        }
    });
}

function getUsers(req, res) {
    User.find()
        .then(users => res.json(users))
        .catch(e => next(e));
}

export default { create, login, updateUser, uploadImage, getImageFile, getUsers }
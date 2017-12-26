import express from 'express';
import userController from '../controllers/user'
import expressJwt from 'express-jwt';
import config from '../config/config';

const router = express.Router();

router.route('/')
    .get(userController.getUsers)
    .post(userController.create);
router.route('/login')
    .post(userController.login);
router.route('/:userId')
    .put(expressJwt({ secret: config.jwtSecret }),
    userController.update);
router.route('/:userId/picture')
    .post(expressJwt({ secret: config.jwtSecret }),
    userController.uploadPhoto)
    .get(userController.getPhoto)
export default router;
import express from 'express';
import userController from '../controllers/user'

const router = express.Router();

router.route('/')
    .get(userController.getUsers)
    .post(userController.create);
router.route('/login')
    .post(userController.login);

export default router;
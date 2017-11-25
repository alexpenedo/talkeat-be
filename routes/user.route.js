import express from 'express';
import userController from '../controllers/user'
import md_auth from '../middlewares/authenticated';
import multipart from 'connect-multiparty'

const router = express.Router();
const md_upload = multipart({ uploadDir: './uploads/users' });

router.route('/')
    .get(userController.getUsers)
    .post(userController.create);
router.route('/login')
    .post(userController.login);
// router.route('/:id')
//     .put(md_auth.ensureAuth, userController.updateUser);


// router.param('id', userController.load);

export default router;
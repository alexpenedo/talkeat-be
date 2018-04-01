import express from 'express';
import chatController from '../controllers/chat';
import expressJwt from 'express-jwt';
import config from '../config/config';

const router = express.Router();

router.route('/')
    .get(expressJwt({ secret: config.jwtSecret }),
        chatController.findByGuestIdOrHostId)

export default router;
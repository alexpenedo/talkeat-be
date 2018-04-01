import express from 'express';
import bookingController from '../controllers/booking';
import expressJwt from 'express-jwt';
import config from '../config/config';

const router = express.Router();

router.route('/')
    .post(expressJwt({ secret: config.jwtSecret }),
        bookingController.create)
    .get(expressJwt({ secret: config.jwtSecret }),
        bookingController.findByGuestIdOrHostId)

export default router;
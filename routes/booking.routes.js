import express from 'express';
import bookingController from '../controllers/booking';
import expressJwt from 'express-jwt';
import config from '../config/config';

const router = express.Router();

router.route('/')
    .post(expressJwt({ secret: config.jwtSecret }),
        bookingController.create)
    .get(expressJwt({ secret: config.jwtSecret }),
        bookingController.findByGuestIdOrHostId);
router.route('/:bookingId')
    .get(expressJwt({ secret: config.jwtSecret }),
        bookingController.get);

/** Load booking when API with bookingId route parameter is hit */
router.param('bookingId', bookingController.load);

export default router;
import express from 'express';
import menuController from '../controllers/menu'
import bookingController from '../controllers/booking'
import expressJwt from 'express-jwt';
import config from '../config/config';

const router = express.Router();

router.route('/')
    .post(expressJwt({secret: config.jwtSecret}),
        menuController.create)
    .get(expressJwt({secret: config.jwtSecret}),
        menuController.find);


router.route('/:menuId')
    .get(expressJwt({secret: config.jwtSecret}),
        menuController.get)
    .put(expressJwt({secret: config.jwtSecret}),
        menuController.update);
router.route('/:menuId/bookings')
    .get(expressJwt({secret: config.jwtSecret}),
        bookingController.findByMenuId);

/** Load menu when API with menuId route parameter is hit */
router.param('menuId', menuController.load);

export default router;
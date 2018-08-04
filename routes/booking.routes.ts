import {Router} from 'express';
import bookingController from '../controllers/booking';
import expressJwt from 'express-jwt';
import config from '../config/config';

export class BookingRoutes {
    static routes(): Router {
        const routes: Router = Router();
        routes.route('/')
            .post(expressJwt({secret: config.jwtSecret}),
                bookingController.create)
            .get(expressJwt({secret: config.jwtSecret}),
                bookingController.findByGuestIdOrHostId);
        routes.route('/:bookingId')
            .get(expressJwt({secret: config.jwtSecret}),
                bookingController.get);
        routes.route('/:bookingId/confirm')
            .get(expressJwt({secret: config.jwtSecret}),
                bookingController.confirmBooking);

        /** Load booking when API with bookingId route parameter is hit */
        routes.param('bookingId', bookingController.load);
        return routes;
    }
}
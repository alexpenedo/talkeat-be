import {Router} from 'express';
import menuController from '../controllers/menu'
import bookingController from '../controllers/booking'
import expressJwt from 'express-jwt';
import config from '../config/config';

export class MenuRoutes {
    static routes(): Router {
        const routes: Router = Router();

        routes.route('/')
            .post(expressJwt({secret: config.jwtSecret}),
                menuController.create)
            .get(expressJwt({secret: config.jwtSecret}),
                menuController.find);

        routes.route('/:menuId')
            .get(expressJwt({secret: config.jwtSecret}),
                menuController.get)
            .put(expressJwt({secret: config.jwtSecret}),
                menuController.update);
        routes.route('/:menuId/bookings')
            .get(expressJwt({secret: config.jwtSecret}),
                bookingController.findByMenuId);

        /** Load menu when API with menuId route parameter is hit */
        routes.param('menuId', menuController.load);
        return routes;
    }
}
import {Router} from 'express';
import rateController from '../controllers/rate';
import expressJwt from 'express-jwt';
import config from '../config/config';


export class RateRoutes {
    static routes(): Router {
        const router: Router = Router();

        router.route('/')
            .post(expressJwt({secret: config.jwtSecret}),
                rateController.create)
            .get(expressJwt({secret: config.jwtSecret}),
                rateController.getRatesByHostId);
        router.route('/average')
            .get(expressJwt({secret: config.jwtSecret}),
                rateController.getAverageByHostId);
        return router;
    }
}
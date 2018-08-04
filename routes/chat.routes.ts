import {Router} from 'express';
import chatController from '../controllers/chat';
import expressJwt from 'express-jwt';
import config from '../config/config';

export class ChatRoutes {
    static routes(): Router {
        const routes: Router = Router();
        routes.route('/')
            .get(expressJwt({secret: config.jwtSecret}),
                chatController.findByGuestIdOrHostId);
        return routes;

    }
}
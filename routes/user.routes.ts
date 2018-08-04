import userController from '../controllers/user'
import expressJwt from 'express-jwt';
import config from '../config/config';
import {Router} from "express";

export class UserRoutes {
    static routes(): Router {
        const routes: Router = Router();

        routes.route('/')
            .get(userController.getUsers)
            .post(userController.create);
        routes.route('/login')
            .post(userController.login);
        routes.route('/image')
            .get(userController.getPhoto);
        routes.route('/:userId')
            .get(expressJwt({secret: config.jwtSecret}),
                userController.get)
            .put(expressJwt({secret: config.jwtSecret}),
                userController.update);
        routes.route('/:userId/picture')
            .post(expressJwt({secret: config.jwtSecret}),
                userController.uploadPhoto);
        return routes
    }
}
import {Request, Response, Router} from "express";
import {UserRoutes} from "./user.routes";
import {RateRoutes} from "./rate.routes";
import {MenuRoutes} from "./menu.route";
import {ChatRoutes} from "./chat.routes";
import {BookingRoutes} from "./booking.routes";

export class RouterBase {
    static routes(): Router {
        const router: Router = Router();
        router.get('/health-check', (req: Request, res: Response) => {
            res.status(200).send('OK');
        });
        router.use('/users', UserRoutes.routes());
        router.use('/menus', MenuRoutes.routes());
        router.use('/booking', BookingRoutes.routes());
        router.use('/chat', ChatRoutes.routes());
        router.use('/rate', RateRoutes.routes());
        return router;
    }
}
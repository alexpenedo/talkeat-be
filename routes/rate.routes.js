import express from 'express';
import rateController from '../controllers/rate';
import expressJwt from 'express-jwt';
import config from '../config/config';

const router = express.Router();

router.route('/')
    .post(expressJwt({ secret: config.jwtSecret }),
        rateController.create)
    .get(expressJwt({ secret: config.jwtSecret }),
        rateController.getRatesByHostId);
router.route('/average')
    .get(expressJwt({ secret: config.jwtSecret }),
        rateController.getAverageByHostId)
export default router;
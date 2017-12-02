import express from 'express';
import menuController from '../controllers/menu'
import expressJwt from 'express-jwt';
import config from '../config/config';

const router = express.Router();

router.route('/')
    .post(expressJwt({ secret: config.jwtSecret }),
    menuController.create);


router.route('/:menuId')
    .get(expressJwt({ secret: config.jwtSecret }),
    menuController.get)
    .put(expressJwt({ secret: config.jwtSecret }),
    menuController.update);

/** Load menuTemplate when API with menuId route parameter is hit */
router.param('menuId', menuController.load);

export default router;
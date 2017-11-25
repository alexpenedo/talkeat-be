import express from 'express';
import menuTemplateController from '../controllers/menu'
import expressJwt from 'express-jwt';
import config from '../config/config';

const router = express.Router();

router.route('/')
    .post(expressJwt({ secret: config.jwtSecret }),
    menuTemplateController.create);


router.route('/:menuTemplateId')
    .get(expressJwt({ secret: config.jwtSecret }),
    menuTemplateController.get)
    .put(expressJwt({ secret: config.jwtSecret }),
    menuTemplateController.update);

/** Load menuTemplate when API with menuTemplateId route parameter is hit */
router.param('menuTemplateId', menuTemplateController.load);

export default router;
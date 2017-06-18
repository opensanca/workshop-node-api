import authCtrl from './controller';
import express from 'express';
import expressJwt from 'express-jwt';
import config from '../../config/env';
const router = express.Router();
const jwtAuth = expressJwt({ secret: config.jwtSecret });

router.route('/login').post(authCtrl.login);
router.route('/random-number').get(jwtAuth, authCtrl.getRandomNumber);

export default router;
import UserCtrl from './controller';
import config from '../../config/env';
import paramValidation from '../../config/param-validation';
import express from 'express';
import validate from 'express-validation'
import expressJwt from 'express-jwt';
const router = express.Router();
const jwtAuth = expressJwt({ secret: config.jwtSecret });

router.route('/')
  .get(UserCtrl.list)
  .post(validate(paramValidation.createUser),UserCtrl.create);

router.route('/:userId')
  .get(UserCtrl.get)
  .put(validate(paramValidation.updateUser), UserCtrl.update)
  .delete(UserCtrl.remove);

export default router;
import userController from './controller';
import config from '../../config/env';
import paramValidation from '../../config/param-validation';
import express from 'express';
import validate from 'express-validation'
import expressJwt from 'express-jwt';
const router = express.Router();
const jwtAuth = expressJwt({ secret: config.jwtSecret });

router.route('/')
  .get(userController.list)
  .post(validate(paramValidation.createUser), userController.create);

router.route('/:userId')
  .get(userController.get)
  .put(validate(paramValidation.updateUser), userController.update)
  .delete(userController.remove);

export default router;
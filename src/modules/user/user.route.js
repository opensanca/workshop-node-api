import UserController from './user.controller';
import config from '../../config/env';
import paramValidation from '../../config/param-validation';
import express from 'express';
import validate from 'express-validation'
const router = express.Router();

router.route('/')
  .get(UserController.list)
  .post(validate(paramValidation.createUser), UserController.create);

router.route('/:userId')
  .get(UserController.get)
  .put(validate(paramValidation.updateUser), UserController.update)
  .delete(UserController.remove);

export default router;
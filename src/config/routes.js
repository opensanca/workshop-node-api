import express from 'express';
import UserRoutes from '../modules/user/user.route';
import AuthRoutes from '../modules/auth/auth.route';

const router = express.Router();

router.get('/health-check', (req, res) =>
  res.send('OK')
);

router.use('/users', UserRoutes);
router.use('/auth', AuthRoutes);

export default router;
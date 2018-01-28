import express from 'express';
import userRoutes from './user.route';
import menuRoutes from './menu.route';
import bookingRoutes from './booking.routes';

const router = express.Router();

router.get('/health-check', (req, res) =>
    res.send('OK')
);

router.use('/users', userRoutes);
router.use('/menu', menuRoutes);
router.use('/booking', bookingRoutes)

export default router;
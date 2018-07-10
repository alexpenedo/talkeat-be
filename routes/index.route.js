import express from 'express';
import userRoutes from './user.route';
import menuRoutes from './menu.route';
import bookingRoutes from './booking.routes';
import chatRoutes from './chat.routes';
import rateRoutes from './rate.routes';


const router = express.Router();

router.get('/health-check', (req, res) =>
    res.send('OK')
);

router.use('/users', userRoutes);
router.use('/menu', menuRoutes);
router.use('/booking', bookingRoutes);
router.use('/chat', chatRoutes);
router.use('/rate', rateRoutes);


export default router;
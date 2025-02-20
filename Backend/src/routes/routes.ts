import express from 'express';
import itineraryRouter from '../controllers/itinerary_controller';
import guestRouter from '../controllers/guest_controller';

const router = express.Router();

router.use('/itineraries', itineraryRouter);
router.use('/guests', guestRouter);

export default router;

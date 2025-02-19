import express from 'express';
import itineraryRouter from '../controllers/itinerary_controller';

const router = express.Router();

router.use('/itineraries', itineraryRouter);

export default router;

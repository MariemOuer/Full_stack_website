import express from 'express';
import itineraryRouter from '../controllers/itinerary_controller';
import guestRouter from '../controllers/guest_controller';
import { guestBaseRoute, itineraryBaseRoute } from '@src/utils/constants/route_constants';

const router = express.Router();

router.use(itineraryBaseRoute, itineraryRouter);
router.use(guestBaseRoute, guestRouter);

export default router;

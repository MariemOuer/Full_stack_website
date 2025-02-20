import express from 'express';
import itineraryRouter from '../controllers/itinerary_controller';
import guestRouter from '../controllers/guest_controller';
import { GUEST_BASE_ROUTE, ITINERARY_BASE_ROUTE } from '@src/utils/constants/route_constants';

const router = express.Router();

router.use(ITINERARY_BASE_ROUTE, itineraryRouter);
router.use(GUEST_BASE_ROUTE, guestRouter);

export default router;

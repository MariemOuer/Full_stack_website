import express from 'express';
import itineraryRouter from '../controllers/itinerary_controller';
import invitationRouter from '../controllers/invitation_controller';
import { INVITATION_BASE_ROUTE, ITINERARY_BASE_ROUTE } from '../utils/constants/route_constants';

const router = express.Router();

router.use(ITINERARY_BASE_ROUTE, itineraryRouter);
router.use(INVITATION_BASE_ROUTE, invitationRouter);

export default router;

import express from 'express';
import itineraryRouter from '../controllers/itinerary_controller';
import invitationRouter from '../controllers/invitation_controller';
import userRouter from '../controllers/user_controller';
import { USER_BASE_ROUTE, INVITATION_BASE_ROUTE, ITINERARY_BASE_ROUTE } from '../utils/constants/route_constants';

const router = express.Router();

router.use(ITINERARY_BASE_ROUTE, itineraryRouter);
router.use(INVITATION_BASE_ROUTE, invitationRouter);
router.use(USER_BASE_ROUTE, userRouter);

export default router;

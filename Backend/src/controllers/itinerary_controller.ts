import express from 'express';
import { ItineraryService } from '@src/services/repository_services/itinerary_service';
import { PrismaItineraryRepository } from '@src/repositories/concretes/prisma_itinerary_repository';
import { ResendEmailService } from '@src/services/api/email/concretes/resend_email_service';
import { Request, Response } from 'express';

const router = express.Router();

const itineraryRepository = new PrismaItineraryRepository();
const emailService = new ResendEmailService();
const itinerariesService = new ItineraryService({ itineraryRepository: itineraryRepository, emailService: emailService });

router.get('/created-by/:userId', async (request: Request<{ userId: string }>, response: Response): Promise<any> => {
  const userId = Number(request.params.userId);
  const result = await itinerariesService.fetchAllCreatedItinerariesFromUser(userId);

  if ('error' in result) {
    return response.status(400).json({ error: result.error.message });
  }

  return response.json(result.value);
});

export default router;

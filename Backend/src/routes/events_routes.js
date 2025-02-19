const { PrismaClient } = require('@prisma/client');
const { Router } = require('express');

const router = new Router();
const prisma = new PrismaClient();

router.get('/events', async (request, response) => {
  try {
    const events = await prisma.event.findMany();
    response.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Database query failed: events' });
  }
});

module.exports = router;

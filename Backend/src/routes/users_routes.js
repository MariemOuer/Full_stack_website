const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/users', async (request, response) => {
  try {
    const users = await prisma.user.findMany();
    response.json(users);
  } catch (error) {
    response.status(500).json({ error: 'Database query failed: users' });
  }
});

module.exports = router;

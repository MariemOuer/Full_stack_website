const { PrismaClient, GuestStatus } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Seeding Users
  const user1 = await prisma.user.upsert({
    where: { email: 'user1@example.com' },
    update: {},
    create: {
      name: 'User One',
      email: 'user1@example.com',
      phoneNumber: '1234567890',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'user2@example.com' },
    update: {},
    create: {
      name: 'User Two',
      email: 'user2@example.com',
      phoneNumber: '0987654321',
    },
  });

  // Seeding Events
  const event1 = await prisma.event.create({
    data: {
      title: 'Birthday Party',
      date: new Date('2025-03-01T18:00:00Z'),
      location: 'Downtown Hall',
      partySize: 50,
      createdBy: { connect: { id: user1.id } },
    },
  });

  const event2 = await prisma.event.create({
    data: {
      title: 'Office Gathering',
      date: new Date('2025-04-15T19:30:00Z'),
      location: 'Corporate Lounge',
      partySize: 30,
      createdBy: { connect: { id: user2.id } },
    },
  });

  // Seeding Guest List
  await prisma.guestList.createMany({
    data: [
      { userId: user1.id, eventId: event2.id, status: GuestStatus.CONFIRMED },
      { userId: user2.id, eventId: event1.id, status: GuestStatus.INVITED },
    ],
  });

  // Seeding Budgets
  await prisma.budget.createMany({
    data: [
      {
        eventId: event1.id,
        themeDecorCost: 500.0,
        venueCost: 2000.0,
        cateringCost: 1500.0,
        entertainmentCost: 800.0,
        additionalCost: 200.0,
      },
      {
        eventId: event2.id,
        themeDecorCost: 300.0,
        venueCost: 1800.0,
        cateringCost: 1200.0,
        entertainmentCost: 600.0,
        additionalCost: 150.0,
      },
    ],
  });

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient, InvitationStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ✅ Create 5 Users
  await prisma.user.createMany({
    data: [
      { email: 'alice@example.com', phoneNumber: '1234567890', name: 'Alice', authId: 'auth_alice' },
      { email: 'bob@example.com', phoneNumber: '0987654321', name: 'Bob', authId: 'auth_bob' },
      { email: 'carol@example.com', phoneNumber: '1112223333', name: 'Carol', authId: 'auth_carol' },
      { email: 'dave@example.com', phoneNumber: '4445556666', name: 'Dave', authId: 'auth_dave' },
      { email: 'eve@example.com', phoneNumber: '7778889999', name: 'Eve', authId: 'auth_eve' },
    ],
  });

  console.log('✅ 5 Users created.');

  // Fetch all users
  const allUsers = await prisma.user.findMany();

  // ✅ Create 3 Itineraries
  await prisma.itinerary.createMany({
    data: [
      { id: 'itinerary-1', title: 'Birthday Party', date: new Date('2025-06-15'), location: 'New York', partySize: 10, creatorId: allUsers[0].id },
      { id: 'itinerary-2', title: 'Work Conference', date: new Date('2025-07-20'), location: 'San Francisco', partySize: 30, creatorId: allUsers[1].id },
      { id: 'itinerary-3', title: 'Family Reunion', date: new Date('2025-08-05'), location: 'Chicago', partySize: 20, creatorId: allUsers[2].id },
    ],
  });

  console.log('✅ 3 Itineraries created.');

  // ✅ Create 6 Invitations
  await prisma.invitation.createMany({
    data: [
      { userId: allUsers[1].id, itineraryId: 'itinerary-1', status: InvitationStatus.CONFIRMED },
      { userId: allUsers[2].id, itineraryId: 'itinerary-1', status: InvitationStatus.INVITED },
      { userId: allUsers[3].id, itineraryId: 'itinerary-2', status: InvitationStatus.CONFIRMED },
      { userId: allUsers[4].id, itineraryId: 'itinerary-2', status: InvitationStatus.DECLINED },
      { userId: allUsers[0].id, itineraryId: 'itinerary-3', status: InvitationStatus.INVITED },
      { userId: allUsers[2].id, itineraryId: 'itinerary-3', status: InvitationStatus.CONFIRMED },
    ],
  });

  console.log('✅ 6 Invitations created.');

  // ✅ Create 3 Budgets
  await prisma.budget.createMany({
    data: [
      { itineraryId: 'itinerary-1', themeDecorCost: 500, venueCost: 1000, cateringCost: 750, entertainmentCost: 200, additionalCost: 100 },
      { itineraryId: 'itinerary-2', themeDecorCost: 800, venueCost: 2000, cateringCost: 1500, entertainmentCost: 500, additionalCost: 250 },
      { itineraryId: 'itinerary-3', themeDecorCost: 600, venueCost: 1200, cateringCost: 900, entertainmentCost: 300, additionalCost: 150 },
    ],
  });

  console.log('✅ 3 Budgets created.');
  console.log('🌱 ✅ Seeding complete!');
}

main()
  .catch((error) => {
    console.error('❌ Error seeding database:', error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

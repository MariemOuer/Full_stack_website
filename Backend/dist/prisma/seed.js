"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { PrismaClient, GuestStatus } = require('@prisma/client');
const prisma = new PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('🌱 Seeding database...');
        const user1 = yield prisma.user.upsert({
            where: { email: 'user1@example.com' },
            update: {},
            create: {
                name: 'User One',
                email: 'user1@example.com',
                phoneNumber: '1234567890',
            },
        });
        const user2 = yield prisma.user.upsert({
            where: { email: 'user2@example.com' },
            update: {},
            create: {
                name: 'User Two',
                email: 'user2@example.com',
                phoneNumber: '0987654321',
            },
        });
        const event1 = yield prisma.event.create({
            data: {
                title: 'Birthday Party',
                date: new Date('2025-03-01T18:00:00Z'),
                location: 'Downtown Hall',
                partySize: 50,
                createdBy: { connect: { id: user1.id } },
            },
        });
        const event2 = yield prisma.event.create({
            data: {
                title: 'Office Gathering',
                date: new Date('2025-04-15T19:30:00Z'),
                location: 'Corporate Lounge',
                partySize: 30,
                createdBy: { connect: { id: user2.id } },
            },
        });
        yield prisma.guestList.createMany({
            data: [
                { userId: user1.id, eventId: event2.id, status: GuestStatus.CONFIRMED },
                { userId: user2.id, eventId: event1.id, status: GuestStatus.INVITED },
            ],
        });
        yield prisma.budget.createMany({
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
    });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));

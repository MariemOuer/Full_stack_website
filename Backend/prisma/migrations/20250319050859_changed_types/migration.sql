-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('INVITED', 'CONFIRMED', 'DECLINED');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "name" TEXT NOT NULL,
    "authId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Itinerary" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "partySize" INTEGER NOT NULL DEFAULT 1,
    "creatorId" INTEGER,

    CONSTRAINT "Itinerary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invitation" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "itineraryId" TEXT NOT NULL,
    "rsvpDeadline" TIMESTAMP(3) NOT NULL,
    "status" "InvitationStatus" NOT NULL DEFAULT 'INVITED',
    "plusOnes" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Invitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Budget" (
    "id" SERIAL NOT NULL,
    "themeDecorCost" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "venueCost" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "cateringCost" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "entertainmentCost" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "additionalCost" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "itineraryId" TEXT NOT NULL,

    CONSTRAINT "Budget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatbotMemorySnapshot" (
    "id" SERIAL NOT NULL,
    "user_email" VARCHAR(255),
    "event_name" VARCHAR(255),
    "event_type" VARCHAR(255),
    "event_date" VARCHAR(255),
    "event_length" VARCHAR(255),
    "guest_count" VARCHAR(255),
    "location" VARCHAR(255),
    "catering" VARCHAR(255),
    "theme" VARCHAR(255),
    "entertainment" VARCHAR(255),
    "budget" DECIMAL(10,2),
    "accommodations" VARCHAR(255),
    "special_requests" TEXT,
    "event_timeline" JSONB,
    "created_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatbotMemorySnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "User_authId_key" ON "User"("authId");

-- CreateIndex
CREATE UNIQUE INDEX "Invitation_userId_itineraryId_key" ON "Invitation"("userId", "itineraryId");

-- CreateIndex
CREATE UNIQUE INDEX "Budget_itineraryId_key" ON "Budget"("itineraryId");

-- AddForeignKey
ALTER TABLE "Itinerary" ADD CONSTRAINT "Itinerary_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_itineraryId_fkey" FOREIGN KEY ("itineraryId") REFERENCES "Itinerary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Budget" ADD CONSTRAINT "Budget_itineraryId_fkey" FOREIGN KEY ("itineraryId") REFERENCES "Itinerary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

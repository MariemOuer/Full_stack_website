/*
  Warnings:

  - You are about to drop the `InvitationTemplates` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "InvitationTemplates" DROP CONSTRAINT "InvitationTemplates_userAuthId_fkey";

-- DropTable
DROP TABLE "InvitationTemplates";

-- CreateTable
CREATE TABLE "InvitationTemplate" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "rawHTML" TEXT NOT NULL,
    "userAuthId" TEXT NOT NULL,

    CONSTRAINT "InvitationTemplate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "InvitationTemplate" ADD CONSTRAINT "InvitationTemplate_userAuthId_fkey" FOREIGN KEY ("userAuthId") REFERENCES "User"("authId") ON DELETE RESTRICT ON UPDATE CASCADE;

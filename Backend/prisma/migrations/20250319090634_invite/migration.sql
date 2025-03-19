-- CreateTable
CREATE TABLE "InvitationTemplates" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "rawHTML" TEXT NOT NULL,
    "userAuthId" TEXT NOT NULL,

    CONSTRAINT "InvitationTemplates_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "InvitationTemplates" ADD CONSTRAINT "InvitationTemplates_userAuthId_fkey" FOREIGN KEY ("userAuthId") REFERENCES "User"("authId") ON DELETE RESTRICT ON UPDATE CASCADE;

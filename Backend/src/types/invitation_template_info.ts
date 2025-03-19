import { InvitationTemplate } from "@prisma/client";

export type InvitationTemplateInfo = Omit<InvitationTemplate, "id">;

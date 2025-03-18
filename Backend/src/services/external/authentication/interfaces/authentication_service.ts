import { User } from "@prisma/client";
import { Result } from "../../../../utils/result/result";

export interface AuthenticationService {
  authenticateUser(token: String): Promise<Result<User>>;
}

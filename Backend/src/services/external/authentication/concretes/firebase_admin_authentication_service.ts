import { User } from "@prisma/client";
import { UserRepository } from "../../../../repositories/interfaces/user_repository";
import { Result } from "../../../../utils/result/result";
import { AuthenticationService } from "../interfaces/authentication_service";
import admin from "../../../../firebaseAdmin";

export class FirebaseAdminAuthenticationService
  implements AuthenticationService
{
  private userRepository: UserRepository;

  constructor({ userRepository }: { userRepository: UserRepository }) {
    this.userRepository = userRepository;
  }

  async authenticateUser(token: string): Promise<Result<User>> {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const authId = decodedToken.uid;

    return await this.userRepository.getUserByAuthId(authId);
  }
}

import { User } from "@prisma/client";
import { UserRepository } from "../../../../repositories/interfaces/user_repository";
import { Result } from "../../../../utils/result/result";
import { AuthenticationService } from "../interfaces/authentication_service";
import admin from "../../../../firebase_admin";

export class FirebaseAdminAuthenticationService implements AuthenticationService {
  private userRepository: UserRepository;

  constructor({ userRepository }: { userRepository: UserRepository }) {
    this.userRepository = userRepository;
  }

  async authenticateUser(token: string): Promise<Result<User>> {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const tokenAuthId = decodedToken.uid;
    return await this.userRepository.getUserByAuthId(tokenAuthId);
  }
}

import { UserRepository } from "../../repositories/interfaces/user_repository";
import { UserInfo } from "../../types/user_info";
import { User } from "@prisma/client";
import { Result } from "../../utils/result/result";

export class UserService {
  private userRepository;

  constructor({ userRepository }: { userRepository: UserRepository }) {
    this.userRepository = userRepository;
  }

  async createUser(userInfo: UserInfo): Promise<Result<User>> {
    return this.userRepository.createUser(userInfo);
  }

  async deleteUser(userAuthId: string): Promise<Result<User>> {
    return this.userRepository.deleteUserByAuthId(userAuthId);
  }
}

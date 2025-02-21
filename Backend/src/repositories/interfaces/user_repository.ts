import { User } from '@prisma/client';
import { Result } from '@src/utils/result';

export interface UserRepository {
  getUserById(userId: number): Promise<Result<User>>;
  getUsersByIds(userIds: number[]): Promise<Result<User[]>>;
  getUserByAuthId(authId: string): Promise<Result<User>>;
  getUserByEmail(email: string): Promise<Result<User>>;
  getUserByItineraryId(itineraryUUID: string): Promise<Result<User>>;
  createUser(user: Omit<User, 'id'>): Promise<Result<User>>;
  updateUser(userId: number, data: Partial<User>): Promise<Result<User>>;
  deleteUserByAuthId(authId: string): Promise<Result<User>>;
}

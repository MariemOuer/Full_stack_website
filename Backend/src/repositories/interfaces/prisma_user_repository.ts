import { User } from '@prisma/client';
import { Failure, Ok, Result } from '@src/utils/result';
import { UserRepository } from './user_repository';

export class PrismaUserRepository implements UserRepository {
  async updateUser(userId: number, data: Partial<User>): Promise<Result<User>> {
    try {
      return await prisma.user.update({ where: { id: userId }, data: data });
    } catch (error) {
      return Failure(error as Error);
    }
  }
  async getUserById(userId: number): Promise<Result<User>> {
    try {
      const user: User = await prisma.user.findUnique({ where: { id: userId } });
      return user ? Ok(user) : Failure(new Error('Database Error: user not found'));
    } catch (error) {
      return Failure(error as Error);
    }
  }
  async getUserByAuthId(authId: string): Promise<Result<User>> {
    try {
      const user: User = await prisma.user.findUnique({ where: { authId: authId } });
      return user ? Ok(user) : Failure(new Error('Database Error: user not found'));
    } catch (error) {
      return Failure(error as Error);
    }
  }
  async createUser(user: Omit<User, 'id'>): Promise<Result<User>> {
    try {
      return await prisma.user.create({ data: user });
    } catch (error) {
      return Failure(error as Error);
    }
  }
}

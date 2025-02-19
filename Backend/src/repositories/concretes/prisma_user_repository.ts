import { User } from '@prisma/client';
import { Failure, Ok, Result } from '@src/utils/result';
import { UserRepository } from '../interfaces/user_repository';
import prisma from '@src/utils/constants/prisma';

export class PrismaUserRepository implements UserRepository {
  async deleteUserByAuthId(authId: string): Promise<Result<boolean>> {
    try {
      await prisma.user.delete({ where: { authId: authId } });
      return Ok(true);
    } catch (error) {
      return Failure(error as Error);
    }
  }
  async updateUser(userId: number, data: Partial<User>): Promise<Result<User>> {
    try {
      const user: User = await prisma.user.update({ where: { id: userId }, data: data });
      return Ok(user);
    } catch (error) {
      return Failure(error as Error);
    }
  }
  async getUserById(userId: number): Promise<Result<User>> {
    try {
      const user: User | null = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
      return user ? Ok(user) : Failure(new Error('Database Error: user not found'));
    } catch (error) {
      return Failure(error as Error);
    }
  }

  async getUserByAuthId(authId: string): Promise<Result<User>> {
    try {
      const user: User | null = await prisma.user.findUniqueOrThrow({ where: { authId } });
      return user ? Ok(user) : Failure(new Error('Database Error: user not found'));
    } catch (error) {
      return Failure(error as Error);
    }
  }

  async createUser(user: Omit<User, 'id'>): Promise<Result<User>> {
    try {
      const createdUser: User = await prisma.user.create({ data: user });
      return Ok(createdUser);
    } catch (error) {
      return Failure(error as Error);
    }
  }
}

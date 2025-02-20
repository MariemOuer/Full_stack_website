import { User } from '@prisma/client';
import { Result } from '@src/utils/result';
import { UserRepository } from '../interfaces/user_repository';
import PRISMA from '@src/utils/constants/prisma';

class PrismaUserRepository implements UserRepository {
  async getUserByEmail(email: string): Promise<Result<User>> {
    try {
      const user: User = await PRISMA.user.findUniqueOrThrow({ where: { email: email } });
      return Result.ok(user);
    } catch (error) {
      return Result.error(error as Error);
    }
  }
  async getUserByItineraryId(itineraryUUID: string): Promise<Result<User>> {
    try {
      const user: User = await PRISMA.user.findFirstOrThrow({
        where: {
          userCreatedItineraries: {
            some: { id: itineraryUUID },
          },
        },
      });
      return Result.ok(user);
    } catch (error) {
      return Result.error(error as Error);
    }
  }

  async getUsersByIds(userIds: number[]): Promise<Result<User[]>> {
    try {
      const users: User[] = await Promise.all(userIds.map(async (userId) => await PRISMA.user.findUniqueOrThrow({ where: { id: userId } })));
      return Result.ok(users);
    } catch (error) {
      return Result.error(error as Error);
    }
  }
  async deleteUserByAuthId(authId: string): Promise<Result<boolean>> {
    try {
      await PRISMA.user.delete({ where: { authId: authId } });
      return Result.ok(true);
    } catch (error) {
      return Result.error(error as Error);
    }
  }
  async updateUser(userId: number, data: Partial<User>): Promise<Result<User>> {
    try {
      const user: User = await PRISMA.user.update({
        where: { id: userId },
        data: data,
      });
      return Result.ok(user);
    } catch (error) {
      return Result.error(error as Error);
    }
  }
  async getUserById(userId: number): Promise<Result<User>> {
    try {
      const user: User | null = await PRISMA.user.findUniqueOrThrow({
        where: { id: userId },
      });
      return user ? Result.ok(user) : Result.error(new Error('Database Error: user not found'));
    } catch (error) {
      return Result.error(error as Error);
    }
  }

  async getUserByAuthId(authId: string): Promise<Result<User>> {
    try {
      const user: User | null = await PRISMA.user.findUniqueOrThrow({
        where: { authId },
      });
      return user ? Result.ok(user) : Result.error(new Error('Database Error: user not found'));
    } catch (error) {
      return Result.error(error as Error);
    }
  }

  async createUser(user: Omit<User, 'id'>): Promise<Result<User>> {
    try {
      const createdUser: User = await PRISMA.user.create({ data: user });
      return Result.ok(createdUser);
    } catch (error) {
      return Result.error(error as Error);
    }
  }
}

export default new PrismaUserRepository();

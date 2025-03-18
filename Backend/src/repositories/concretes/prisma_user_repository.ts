import { User } from '@prisma/client';
import { UserRepository } from '../interfaces/user_repository';
import PRISMA from '../../utils/prisma/prisma_client';
import { safeExecutePrismaOperation } from '../../utils/prisma/prisma_helpers';
import { Result } from '../../utils/result/result';


class PrismaUserRepository implements UserRepository {
  async getUserByEmail(email: string): Promise<Result<User>> {
    return safeExecutePrismaOperation(() => PRISMA.user.findUniqueOrThrow({ where: { email: email } }));
  }
  async getUserByItineraryId(itineraryUUID: string): Promise<Result<User>> {
    return safeExecutePrismaOperation(() =>
      PRISMA.user.findFirstOrThrow({
        where: {
          userCreatedItineraries: {
            some: { id: itineraryUUID },
          },
        },
      })
    );
  }

  async getUsersByIds(userIds: number[]): Promise<Result<User[]>> {
    return safeExecutePrismaOperation(() => Promise.all(userIds.map(async (userId) => await PRISMA.user.findUniqueOrThrow({ where: { id: userId } }))));
  }
  async deleteUserByAuthId(authId: string): Promise<Result<User>> {
    return safeExecutePrismaOperation(() => PRISMA.user.delete({ where: { authId: authId } }));
  }
  async updateUser(userId: number, data: Partial<User>): Promise<Result<User>> {
    return safeExecutePrismaOperation(() =>
      PRISMA.user.update({
        where: { id: userId },
        data: data,
      })
    );
  }
  async getUserById(userId: number): Promise<Result<User>> {
    return safeExecutePrismaOperation(() =>
      PRISMA.user.findUniqueOrThrow({
        where: { id: userId },
      })
    );
  }

  async getUserByAuthId(authId: string): Promise<Result<User>> {
    return safeExecutePrismaOperation(() =>
      PRISMA.user.findUniqueOrThrow({
        where: { authId },
      })
    );
  }

  async createUser(user: Omit<User, 'id'>): Promise<Result<User>> {
    return safeExecutePrismaOperation(() => PRISMA.user.create({ data: {
      name: user.name,
      email: user.email,
      authId: user.authId ?? null,
      phoneNumber: user.phoneNumber ?? null
    }}));
  }
}

export default new PrismaUserRepository();

import { Prisma } from '@prisma/client';
import { Result } from '../result';

export type PrismaErrorResponse = {
  errorReason: string;
  errorCode: string;
  errorMessage: string;
};

export function handlePrismaError(error: unknown): Error {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const prismaErrorResponse: PrismaErrorResponse = {
      errorReason: error.meta ? JSON.stringify(error.meta) : 'Unknown',
      errorCode: error.code,
      errorMessage: error.message,
    };

    return new Error(JSON.stringify(prismaErrorResponse));
  }

  return error as Error;
}

export async function safeExecutePrismaOperation<T>(operation: () => Promise<T>): Promise<Result<T>> {
  try {
    const result = await operation();
    return Result.ok(result);
  } catch (error) {
    return Result.error(handlePrismaError(error));
  }
}

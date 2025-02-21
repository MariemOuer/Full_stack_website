import { Prisma } from '@prisma/client';
import { Failure, Result } from '../result/result';
import { safeExecute } from '../general_error_helpers';

export type PrismaErrorResponse = {
  errorReason: string;
  errorCode: string;
  errorMessage: string;
};

export function handlePrismaError<K>(error: unknown): Result<K> {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const prismaErrorResponse: PrismaErrorResponse = {
      errorReason: error.meta ? JSON.stringify(error.meta) : 'Unknown',
      errorCode: error.code,
      errorMessage: error.message,
    };

    return Result.error(new Error(JSON.stringify(prismaErrorResponse)));
  }

  return Result.error(error as Error);
}

export async function safeExecutePrismaOperation<K>(operation: () => Promise<K>): Promise<Result<K>> {
  const result = await safeExecute(operation);
  if (result instanceof Failure) return handlePrismaError<K>(result);
  return result;
}

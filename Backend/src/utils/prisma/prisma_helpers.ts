import { Prisma } from '@prisma/client';
import { Failure, Result } from '../result/result';
import { safeExecute } from '../general_error_helpers';

export class PrismaError extends Error {
  constructor(
    public readonly errorCode: string,
    public readonly errorPointOfFailure: any,
    public readonly explanation?: string
  ) {
    super(`Prisma Error [${errorCode}]: ${explanation ?? 'No explanation available'}`);
    this.name = 'Prisma Error';
  }
}

export function handlePrismaError<K>(failure: Prisma.PrismaClientKnownRequestError, errorCodeToResponseMap?: Map<string, string>): Failure<K, PrismaError> {
  return new Failure<K, PrismaError>(new PrismaError(failure.code, failure.meta, errorCodeToResponseMap?.get(failure.code)));
}

export async function safeExecutePrismaOperation<K, E extends Error>(
  operation: () => Promise<K>,
  errorCodeToResponseMap?: Map<string, string>
): Promise<Result<K, E | PrismaError>> {
  const result = await safeExecute<K, E>(operation);

  if (result instanceof Failure) {
    return result.error instanceof Prisma.PrismaClientKnownRequestError ? handlePrismaError<K>(result.error, errorCodeToResponseMap) : result;
  }

  return result;
}

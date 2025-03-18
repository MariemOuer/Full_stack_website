import { Prisma } from "@prisma/client";
import { Failure, Result } from "../result/result";
import { safeExecute } from "../general_error_helpers";

export class PrismaError extends Error {
  constructor(
    public readonly errorCode: string,
    public readonly errorPointOfFailure: any,
    public readonly explanation?: string
  ) {
    super(
      `Prisma Error [${errorCode}]: ${explanation ?? "No explanation available"}`
    );
  }
}

export function handlePrismaError<K>(
  error:
    | Prisma.PrismaClientKnownRequestError
    | Prisma.PrismaClientValidationError,
  errorCodeToResponseMap?: Map<string, string>
): Failure<K, PrismaError> {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return new Failure<K, PrismaError>(
      new PrismaError(
        error.code,
        (error as Prisma.PrismaClientKnownRequestError).meta,
        errorCodeToResponseMap?.get(error.code)
      )
    );
  }

  return new Failure<K, PrismaError>(
    new PrismaError(" ", error.message, error.stack)
  );
}

export async function safeExecutePrismaOperation<K, E extends Error>(
  operation: () => Promise<K>,
  errorCodeToResponseMap?: Map<string, string>
): Promise<Result<K, E | PrismaError>> {
  const result = await safeExecute<K, E>(operation);

  if (result instanceof Failure) {
    if (
      result.error instanceof Prisma.PrismaClientKnownRequestError ||
      result.error instanceof Prisma.PrismaClientValidationError
    ) {
      return handlePrismaError<K>(result.error, errorCodeToResponseMap);
    }
    return result;
  }

  return result;
}

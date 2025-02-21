import { Failure, Ok, Result } from './result/result';

export async function safeExecute<K, E extends Error = Error>(operation: () => Promise<K>): Promise<Result<K, E>> {
  try {
    const result = await operation();
    return flattenResult(Result.ok(result));
  } catch (error) {
    return error instanceof Error ? Result.error<K, E>(error as E) : Result.error<K, E>(new Error('Unknown') as E);
  }
}

function flattenResult<K, E extends Error>(result: Result<K, E>): Result<K, E> {
  while ((result instanceof Ok && result.value instanceof Result) || (result instanceof Failure && result.error instanceof Failure)) {
    result = result.isOk() ? flattenOkResult(result) : flattenFailureResult(result);
  }
  return result;
}

function flattenOkResult<K, E extends Error>(result: Result<K, E>): Result<K, E> {
  while (result instanceof Ok && result.value instanceof Result) {
    result = result.value;
  }
  return result;
}

function flattenFailureResult<K, E extends Error>(result: Result<K, E>): Result<K, E> {
  while (result instanceof Failure && result.error instanceof Failure) {
    result = result.error;
  }
  return result;
}

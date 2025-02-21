import { Failure, Ok, Result } from './result/result';

export async function safeExecute<K>(operation: () => Promise<K>): Promise<Result<K>> {
  try {
    const result = await operation();

    return flattenResult(Result.ok(result));
  } catch (error) {
    return Result.error(error as Error);
  }
}

function flattenResult<K>(result: Result<K>): Result<K> {
  while ((result instanceof Ok && result.value instanceof Result) || (result instanceof Failure && result.error instanceof Result)) {
    result = result.isOk() ? flattenOkResult(result) : flattenFailureResult(result);
  }
  return result;
}

function flattenOkResult<K>(result: Result<K>): Result<K> {
  while (result instanceof Ok && result.value instanceof Result) {
    result = result.value;
  }
  return result;
}
function flattenFailureResult<K>(result: Result<K>): Result<K> {
  while (result instanceof Failure && result.error instanceof Result) {
    result = result.error;
  }
  return result;
}

import { Failure, Ok, Result } from './result';

export function combineErrors(errors: Error[]): Error {
  const combinedMessage = errors.map((err) => err.message).join(' && ');
  const combinedError = new Error(combinedMessage);

  (combinedError as any).errors = errors;

  return combinedError;
}

export function consumeResult<K, T>(result: Result<K> | Error, onSuccess: (value: K) => T, onError: (error: Error) => T): T {
  if (result instanceof Error) return onError(result);

  return result.isOk() ? onSuccess((result as Ok<K>).value) : onError((result as Failure<K>).error);
}

export function getOkValueFromResult<K>(result: Result<K>): K {
  return (result as Ok<K>).value;
}

export function getErrorFromResult<K>(result: Result<K>): Result<K> {
  return result.isError()
    ? Result.error<K>(result.error)
    : Result.error<K>(new Error(`Cannot get error from Ok result. The Ok returned: ${JSON.stringify((result as Ok<K>).value)}`));
}

export function adaptResultForReturn<K, T>(result: Result<T>): Result<K> {
  return result as unknown as Result<K>;
}

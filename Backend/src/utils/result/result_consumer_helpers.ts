import { Failure, Ok, Result } from './result';

export function consumeResult<K, T>(result: Result<K> | Error, onSuccess: (value: K) => T, onError: (error: Error) => T): T {
  if (result instanceof Error) return onError(result);

  return result.isOk() ? onSuccess((result as Ok<K>).value) : onError((result as Failure<K>).error);
}

export function getOkValueFromResult<K>(result: Result<K>): K {
  return (result as Ok<K>).value;
}

export function adaptResultForReturn<K, T, E extends Error>(result: Result<T>): Result<K> {
  if (result instanceof Failure) {
    return new Failure<K, E>(result.error);
  }
  return result as unknown as Result<K>;
}

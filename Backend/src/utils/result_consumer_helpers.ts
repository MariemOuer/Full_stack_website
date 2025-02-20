import { Failure, Ok, Result } from './result';

export function combineErrors(errors: Error[]): Error {
  const combinedMessage = errors.map((err) => err.message).join(' && ');
  const combinedError = new Error(combinedMessage);

  (combinedError as any).errors = errors;

  return combinedError;
}

export function consumeResult<K, T>(result: Result<K>, onSuccess: (value: K) => T, onError: (error: Error) => T): T {
  return result.isOk() ? onSuccess((result as Ok<K>).value) : onError((result as Failure<K>).error);
}

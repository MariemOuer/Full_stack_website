export abstract class Result<K, E extends Error = Error> {
  static ok<T>(value: T): Result<T, never> {
    return new Ok(value);
  }

  static error<T, E extends Error>(error: E): Result<T, E> {
    return new Failure(error);
  }

  isOk(): this is Ok<K> {
    return this instanceof Ok;
  }

  isError(): this is Failure<K, E> {
    return this instanceof Failure;
  }
}

export class Ok<K> extends Result<K, never> {
  constructor(public readonly value: K) {
    super();
  }
}

export class Failure<K, E extends Error = Error> extends Result<K, E> {
  constructor(public readonly error: E) {
    super();
  }
}

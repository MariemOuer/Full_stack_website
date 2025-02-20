export abstract class Result<T> {
  static ok<T>(value: T): Result<T> {
    return new Ok(value);
  }

  static error<T>(error: Error): Result<T> {
    return new Failure(error);
  }

  abstract isOk(): this is Ok<T>;
  abstract isError(): this is Failure<T>;
}

export class Ok<T> extends Result<T> {
  constructor(public readonly value: T) {
    super();
  }

  isOk(): this is Ok<T> {
    return true;
  }

  isError(): this is Failure<T> {
    return false;
  }
}

export class Failure<T> extends Result<T> {
  constructor(public readonly error: Error) {
    super();
  }

  isOk(): this is Ok<T> {
    return false;
  }

  isError(): this is Failure<T> {
    return true;
  }
}

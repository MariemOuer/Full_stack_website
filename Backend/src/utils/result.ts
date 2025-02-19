export type Result<K> = { value: K } | { error: Error };

export function Ok<K>(value: K): Result<K> {
  return { value };
}

export function Failure(error: Error): Result<never> {
  return { error };
}

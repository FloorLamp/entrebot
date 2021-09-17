export type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;

export type MapType<T, A, B> = {
  [Key in keyof T]: T[Key] extends A
    ? B
    : T[Key] extends Record<any, any>
    ? MapType<T[Key], A, B>
    : T[Key];
};

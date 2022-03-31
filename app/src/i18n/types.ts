export type Messages = Record<string, object>;

export type Loader = () => Promise<Messages>;

export type Namespaced<T> = Record<string, T>;

export type Localized<T> = Record<string, T>;

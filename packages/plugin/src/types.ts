// eslint-disable-next-line @typescript-eslint/naming-convention
export type MarkRequired<T, RK extends keyof T> = Exclude<T, RK> & Required<Pick<T, RK>>

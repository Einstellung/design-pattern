export interface Action<T = any> {
  type: T
}

export type Reducer<S = any, A extends Action = Action> = (
  state: S | undefined,
  action: A
) => S

export interface Dispatch<A extends Action> {
  <T extends A>(action: T, ...extraArgs: any[]): T
}

export interface NCEventConstructor<E> {
  readonly nameSym: symbol
  new(...args: any): E
}

export interface NCEvent {
  readonly nameSym: symbol
}

export function MixinsNCEvent<TBase extends {new (...args: any[]):{} }>(Base: TBase, logName = "") {
  return class Event extends Base implements NCEvent {
    public static readonly nameSym = Symbol(logName)
    public get nameSym(): symbol {
      return Event.nameSym
    }
  }
}

export class NCEventBase<T>{
  constructor (public readonly ids: T[] = []) {
  }
}

export function CreateNCEvent<T = string>(logName = "") {
  return MixinsNCEvent(NCEventBase<T>, logName)
}

// export const DemoEvent = CreateNCEvent()
// export const DemoEvent2 = CreateNCEvent<number>()


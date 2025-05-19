
export interface NCEventConstructor<E> {
  readonly nameSym: symbol
  new(...args: any): E
}

export interface NCEvent {
  readonly nameSym: symbol
}

export function MixinsNCEvent<TBase extends {new(...args: any[]):any}>(Base: TBase, logName = "")
// or NCEventConstructor<NCEvent> & TBase
  : NCEventConstructor<NCEvent & InstanceType<TBase> > {

  return class Event extends Base implements NCEvent {
    public static readonly nameSym = Symbol(logName)
    public get nameSym(): symbol {
      return Event.nameSym
    }
  }
}

export class NCEventBase<T>{
  public readonly ids: T[]
  constructor (ids: T[] = []) {
    this.ids = ids
  }
}

export function CreateNCEvent<T = string>(logName = ""): NCEventConstructor<NCEvent & NCEventBase<T>> {
  return MixinsNCEvent(NCEventBase<T>, logName)
}

// const DemoEvent = CreateNCEvent()
// const DemoEvent2 = CreateNCEvent<number>()



interface Sym {
  sym:symbol
}

export interface EventClass<T, E extends NcEvent<T>> extends Sym{
  new(ids: T[]): E
}

export class NcEvent<T> {
  // static sym = Symbol()

  constructor (ids: T[]) {
    this.ids = ids
  }

  public readonly ids: T[]
}

// not export in index.ts
export function EventSym<T, E extends NcEvent<T>>(e: E): symbol|never {
  let ret = (e.constructor as any as Sym).sym
  if (ret === undefined) {
    throw new Error("please add 'static sym = Symbol()' in every event class")
  }

  return ret
}

let logEvent = 0
export function NewEventClass<T>() {
  return class newEvent extends NcEvent<T>{
    static sym = Symbol(++logEvent)
  }
}


// the DemoEvent1 and the DemoEvent2 are different !
const DemoEvent1 = NewEventClass<string>()

const DemoEvent2 = NewEventClass<string>()

class DemoEvent3 extends NcEvent<string>{
  static sym = Symbol()
}


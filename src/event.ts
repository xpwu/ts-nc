

export interface EventClass<T, E extends NcEvent<T>> {
  new(ids: T[]): E
}

export abstract class NcEvent<T> {

  constructor (ids: T[]) {
    this.ids = ids
  }

  public abstract name(): symbol;

  public readonly ids: T[]

}

class EventDemo extends NcEvent<string>{
  static sym = Symbol()

  name(): symbol {
    return EventDemo.sym;
  }
}


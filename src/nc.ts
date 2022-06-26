import {EventClass, NcEvent} from "./event"

class Observer {
  constructor(public num:number, public observer:symbol | null = null) {
  }
}

export class NC {
  static readonly default = new NC("default")

  private num:number = 0

  private observers = new Map<symbol, number[]>()

  private clbs: Map<number, (e:any)=>void> = new Map<number, (e:any)=>void>()

  private events: Map<symbol, Observer[]> = new Map<symbol, Observer[]>()

  constructor(public readonly logName: string) {

  }

  public addEvent<T, E extends NcEvent<T>>(event: EventClass<T,E>, clb: (e:E, removeIt:()=>void)=>void) {
    let n = ++this.num

    this.clbs.set(n, (e:any)=>{
      clb(e as E, ()=>{
        this.clbs.delete(n)
      })
    })

    let e = new event([])
    let old = this.events.get(e.name()) || []
    old.push(new Observer(n))
    this.events.set(e.name(), old)
  }

  public addObserver<T, E extends NcEvent<T>>(observer:symbol, event: EventClass<T,E>, clb: (e:E)=>void) {
    let n = ++this.num

    this.clbs.set(n, (e:any)=>{
      clb(e as E)
    })

    let e = new event([])
    let old = this.events.get(e.name()) || []
    old.push(new Observer(n, observer))
    this.events.set(e.name(), old)

    let oldO = this.observers.get(observer) || []
    oldO.push(n)
    this.observers.set(observer, oldO)
  }

  public removeEvent<T, E extends NcEvent<T>>(observer:symbol, event: EventClass<T,E>) {
    let e = new event([])
    let es = this.events.get(e.name()) || []
    for (let ee of es) {
      if (ee.observer !== observer) {
        continue
      }

      this.clbs.delete(ee.num)
    }
  }

  public removeAll(observer:symbol) {
    let os = this.observers.get(observer) || []
    for (let o of os) {
      this.clbs.delete(o)
    }
  }

  public post<T, E extends NcEvent<T>>(e: E) {
    let delIndex = new Map<number, boolean>()

    let es = this.events.get(e.name()) || []
    for (let i = 0; i < es.length; i++) {
      let ef = this.clbs.get(es[i].num)
      if (ef === undefined) {
        delIndex.set(i, true)
        continue
      }

      ef(e)
    }

    if (delIndex.size <= es.length/3 || es.length === 0) {
      return
    }

    let newEs: Observer[] = []
    for (let i = 0; i < es.length; i++) {
      if (delIndex.get(i) === true) {
        continue
      }

      newEs.push(es[i])
    }
    this.events.set(e.name(), newEs)
  }
}

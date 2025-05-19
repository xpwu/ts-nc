import {NC, NCObserverItem} from "./nc";
import {NCEvent, NCEventConstructor} from "./event";


const events = Symbol("ncobserver-events")

export class NCObserver {
  [events]: Map<symbol, Map<NC, NCObserverItem>> = new Map<symbol, Map<NC, NCObserverItem>>()

  public addEventTo<T extends NCEvent>(e: NCEventConstructor<T>, toNc:NC, block: (e: T) => void|Promise<void>) {

    let nces = this[events].get(e.nameSym)
    if (nces === undefined) {
      nces = new Map<NC, NCObserverItem>()
      this[events].set(e.nameSym, nces)
    }

    let item = toNc.addEvent(e, block)
    nces.set(toNc, item)
  }

  public removeEventFrom<T extends NCEvent>(e: NCEventConstructor<T>, fromNc:NC) {
    let nces = this[events].get(e.nameSym)
    if (nces === undefined) {
      return
    }

    let item = nces.get(fromNc)
    if (item === undefined) {
      return
    }

    item.remove()
    nces.delete(fromNc)
  }

  public removeAll() {
    for (const [_, nces] of this[events]) {
      for (const [_, item] of nces) {
        item.remove()
      }
    }
    this[events].clear()
  }
}

export function extendNCObserver(derivedClass: {new (...args: any[]): any}) {
  Object.defineProperty(
    derivedClass.prototype,
    events,
    {value: new Map<symbol, Map<NC, NCObserverItem>>()}
  );

  Object.getOwnPropertyNames(NCObserver.prototype).forEach((name) => {
    Object.defineProperty(
      derivedClass.prototype,
      name,
      Object.getOwnPropertyDescriptor(NCObserver.prototype, name) || Object.create(null)
    );
  });
}

/* ----- for example -----

// define a class SomeView
class SomeView {
  c:number = 0
}

// extend the class SomeView
interface SomeView extends NCObserver {}
extendNCObserver(SomeView)

// use
let view = new SomeView()
view.removeAll()
view.c = 3


 */
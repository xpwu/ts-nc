import {NCEventConstructor, NCEvent} from "./event"

export interface NCObserverItem {
  remove(): void
}

class NCItem<T> implements NCObserverItem {
  private readonly id: number
  private readonly queue: Queue<T>

  remove(): void {
    this.queue.remove(this.id)
  }

  constructor(queue: Queue<T>, id: number) {
    this.id = id
    this.queue = queue
  }
}

class Queue<T> {
  private readonly blocks = new Map<number, (e: T) => Promise<void>|void>()
  private id = 0

  public async post(e: T) {
    // 为了防止在执行事件回调时，添加/删除事件对events队列的影响，所以不在events的循环中执行事件函数，而单独执行

    let all = []
    for (let [_, v] of this.blocks) {
      all.push(v)
    }

    let allPromise = []
    for (let v of all) {
      allPromise.push(v(e))
    }

    await Promise.all(allPromise)
  }

  public add(block: (e: T) => Promise<void>|void) : NCObserverItem {
    this.id++
    this.blocks.set(this.id, block)
    return new NCItem(this, this.id)
  }

  public remove(id: number) {
    this.blocks.delete(id)
  }
}

export class NC {

  private readonly events = new Map<symbol, Queue<any>>()

  constructor(public readonly logName: string = "nc") {

  }

  public addEvent<T extends NCEvent>(e: NCEventConstructor<T>, block: (e: T) => void|Promise<void>): NCObserverItem {
    let v = this.events.get(e.nameSym)
    if (v === undefined) {
      v = new Queue<T>()
      this.events.set(e.nameSym, v)
    }

    return v.add(block)
  }

  public async post<T extends NCEvent>(e: T) {
    let q = this.events.get(e.nameSym)
    if (q === undefined) {
      return
    }

    await q.post(e)
  }
}

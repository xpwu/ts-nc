import {NCEventConstructor, NCEvent} from "./event"

export interface NCObserverItem {
  remove(): void
}

class NCItem<T> implements NCObserverItem {
  private readonly id: number
  private readonly queue: Queue<T>
	block: (e: T) => Promise<void>|void

  remove(): void {
    this.queue.remove(this.id)
		// 释放引用
		this.block = ()=>{}
  }

  constructor(queue: Queue<T>, id: number, block: (e: T) => Promise<void>|void) {
    this.id = id
    this.queue = queue
		this.block = block
  }
}

const WeakRef = (globalThis && globalThis.WeakRef) || class<T> {
	[Symbol.toStringTag]: "WeakRef" = "WeakRef"

	target: T
	constructor(target: T) {
		this.target = target
	}

	deref(): T | undefined {
		return this.target
	}
}

class Queue<T> {
  private readonly items = new Map<number, WeakRef<NCItem<T>>>()
  private id = 0

  public async post(e: T) {
    // 为了防止在执行事件回调时，添加/删除事件对events队列的影响，所以不在events的循环中执行事件函数，而单独执行

    let all = []
		let del = []
    for (let [id, v] of this.items) {
			let item = v.deref()
			if (item === undefined) {
				del.push(id)
				continue
			}
      all.push(item.block)
    }

    let allPromise = []
    for (let v of all) {
      allPromise.push(v(e))
    }

    await Promise.all(allPromise)

		for (let id of del) {
			this.items.delete(id)
		}
  }

  public add(block: (e: T) => Promise<void>|void) : NCObserverItem {
    this.id++
		let item = new NCItem(this, this.id, block)
    this.items.set(this.id, new WeakRef(item))
    return item
  }

  public remove(id: number) {
    this.items.delete(id)
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

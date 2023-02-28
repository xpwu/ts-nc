

import {NC, NcEvent, NewEventClass} from "../index"
import {EventSym} from "../src/event"

class TEvent extends NcEvent<string> {
  static sym = Symbol()
}

const DemoEvent = NewEventClass<number>()
const DemoEvent2 = NewEventClass<number>()

class T2Event extends TEvent {
  static readonly sym = Symbol()
}

test("test-sym", ()=>{
  let e1 = new DemoEvent([1])
  let e2 = new DemoEvent2([])
  let e3 = new TEvent(["e3"])

  expect(EventSym(e1)).not.toEqual(EventSym(e2))
  expect(EventSym(e1)).not.toEqual(EventSym(e3))
  expect(EventSym(e2)).not.toEqual(EventSym(e3))
  expect(EventSym(e2)).toEqual(EventSym(e2))
  expect(EventSym(e1)).toEqual(EventSym(e1))
  expect(EventSym(e3)).toEqual(EventSym(e3))
})

let nc:NC = NC.default

beforeEach(()=>{
  nc = new NC("for test")
})

test("new NC", ()=>{
  let nc = new NC("new Nc")
  expect(nc.logName).toEqual("new Nc")
})

test("addEvent", ()=>{
  expect.assertions(1)
  nc.addEvent(TEvent, e =>{
    expect(e.ids).toEqual(["addEvent"])
  })
  nc.addEvent(DemoEvent, e =>{
    expect(e.ids).toEqual(["addEvent"])
  })
  nc.addEvent(T2Event, (e)=>{
    expect(e.ids).toEqual(["addEvent2"])
  })
  nc.post(new TEvent(["addEvent"]))
})

test("addEvent&remove", async ()=>{
  expect.assertions(1)
  nc.addEvent(TEvent, (e, rm)=>{
    expect(e.ids).toEqual(["addEvent"])
    rm()
  })
  nc.addEvent(T2Event, (e)=>{
    expect(e.ids).toEqual(["addEvent2"])
  })
  await nc.post(new TEvent(["addEvent"]))
  await nc.post(new TEvent(["addEvent2"]))
})

async function aFun(): Promise<string> {return ""}

async function aFun2(): Promise<void> {
  return new Promise(resolve => {
    setTimeout(()=>{
      resolve()
    }, 1000)
  })
}

test("addEvent&async", async ()=>{
  expect.assertions(2)
  nc.addEvent(TEvent, async (e, rm)=>{
    rm()
    await aFun()
    expect(e.ids).toEqual(["addEvent"])
  })
  nc.addEvent(T2Event, (e)=>{
    expect(e.ids).toEqual(["addEvent2"])
  })
  await nc.post(new TEvent(["addEvent"]))
  await nc.post(new TEvent(["addEvent0"]))
  await nc.post(new T2Event(["addEvent2"]))
})

test("add", async ()=>{
  expect.assertions(6)
  nc.addEvent(TEvent, async (e)=>{
    await aFun()
    expect(e.ids).toEqual(["addEvent"])
  })
  nc.addEvent(T2Event, (e)=>{
    expect(e.ids).toEqual(["addEvent2"])
  })

  let sym = Symbol()
  nc.addObserver(sym, TEvent, e => {
    expect(e.ids).toEqual(["addEvent"])
  })
  nc.addObserver(sym, TEvent, e => {
    expect(e.ids).toEqual(["addEvent"])
  })

  await nc.post(new TEvent(["addEvent"]))
  await nc.post(new TEvent(["addEvent"]))
})

test("addMore", ()=>{
  expect.assertions(8)
  nc.addEvent(TEvent, (e)=>{
    expect(e.ids).toEqual(["addEvent"])
  })
  nc.addEvent(TEvent, (e)=>{
    expect(e.ids).toEqual(["addEvent"])
  })
  nc.addEvent(TEvent,  (e)=>{
    expect(e.ids).toEqual(["addEvent"])
  })

  nc.post(new TEvent(["addEvent"]))

  let sym = Symbol()
  nc.addObserver(sym, TEvent, e => {
    expect(e.ids).toEqual(["addEvent"])
  })
  nc.addObserver(sym, TEvent, e => {
    expect(e.ids).toEqual(["addEvent"])
  })

  nc.post(new TEvent(["addEvent"]))
})


test("add&rm&async", async ()=>{
  expect.assertions(3)
  nc.addEvent(TEvent, async (e, rm)=>{
    rm()
    await aFun()
    expect(e.ids).toEqual(["addEvent"])
  })
  nc.addEvent(T2Event, (e)=>{
    expect(e.ids).toEqual(["addEvent2"])
  })

  let sym = Symbol()
  nc.addObserver(sym, TEvent, async e => {
    await aFun()
    expect(e.ids).toEqual(["addEvent"])
  })

  await nc.post(new TEvent(["addEvent"]))

  nc.removeAll(sym)
  nc.removeAll(sym)
  nc.removeEvent(sym, TEvent)
  nc.removeAll(sym)
  nc.removeAll(sym)
  nc.removeEvent(sym, TEvent)

  await nc.post(new TEvent(["addEvent"]))

  nc.removeAll(sym)
  nc.removeAll(sym)
  nc.removeEvent(sym, TEvent)
  nc.removeAll(sym)
  nc.removeAll(sym)
  nc.removeEvent(sym, TEvent)

  await nc.post(new T2Event(["addEvent2"]))
})

test("add&rm&async-2", async ()=>{
  expect.assertions(5)
  nc.addEvent(TEvent, async (e, rm)=>{
    rm()
    await aFun2()
    expect(e.ids).toEqual(["addEvent"])
  })

  nc.addEvent(TEvent, (e)=>{
    expect(e.ids).toEqual(["addEvent"])
  })

  let sym = Symbol()
  nc.addObserver(sym, TEvent, async e => {
    await aFun2()
    expect(e.ids).toEqual(["addEvent"])
  })

  await nc.post(new TEvent(["addEvent"]))
  await nc.post(new TEvent(["addEvent"]))
})

test("rm&post", async ()=>{
  expect.assertions(3)
  nc.addEvent(TEvent, async (e, rm)=>{
    rm()
    await aFun()
    expect(e.ids).toEqual(["addEvent"])
  })
  nc.addEvent(T2Event, (e)=>{
    expect(e.ids).toEqual(["addEvent2"])
  })

  let sym = Symbol()
  nc.addObserver(sym, TEvent, e => {
    expect(e.ids).toEqual(["addEvent"])
    nc.removeEvent(sym, TEvent)
    nc.removeAll(sym)
  })

  nc.removeEvent(sym, T2Event)

  await nc.post(new TEvent(["addEvent"]))
  await nc.post(new TEvent(["addEvent"]))
  await nc.post(new T2Event(["addEvent2"]))
})

test("post&add&rm", async ()=>{
  expect.assertions(5)
  nc.addEvent(TEvent, async (e, rm)=>{
    rm()
    await aFun()
    expect(e.ids).toEqual(["addEvent"])
  })
  nc.addEvent(T2Event, (e)=>{
    expect(e.ids).toEqual(["addEvent2"])
  })

  let sym = Symbol()
  nc.addObserver(sym, TEvent, e => {
    expect(e.ids).toEqual(["addEvent"])
    nc.addObserver(sym, TEvent, e=>{
      expect(e.ids).toEqual(["addEvent"])
    })
  })

  await nc.post(new TEvent(["addEvent"]))
  await nc.post(new TEvent(["addEvent"]))
  await nc.post(new T2Event(["addEvent2"]))
})


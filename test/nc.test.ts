

import {NC, NcEvent} from "../src"

class TEvent extends NcEvent<string> {
  static sym = Symbol()

  name(): symbol {
    return TEvent.sym;
  }
}

class T2Event extends NcEvent<string> {
  static sym = Symbol()

  name(): symbol {
    return T2Event.sym;
  }
}

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
  nc.addEvent(T2Event, (e)=>{
    expect(e.ids).toEqual(["addEvent2"])
  })
  nc.post(new TEvent(["addEvent"]))
})

test("addEvent&remove", ()=>{
  expect.assertions(1)
  nc.addEvent(TEvent, (e, rm)=>{
    expect(e.ids).toEqual(["addEvent"])
    rm()
  })
  nc.addEvent(T2Event, (e)=>{
    expect(e.ids).toEqual(["addEvent2"])
  })
  nc.post(new TEvent(["addEvent"]))
  nc.post(new TEvent(["addEvent2"]))
})

async function aFun(): Promise<string> {return ""}

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
  nc.post(new TEvent(["addEvent"]))
  nc.post(new TEvent(["addEvent0"]))
  nc.post(new T2Event(["addEvent2"]))
})

test("add", async ()=>{
  expect.assertions(6)
  nc.addEvent(TEvent, async (e, rm)=>{
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

  nc.post(new TEvent(["addEvent"]))
  nc.post(new TEvent(["addEvent"]))
})


test("add&rm", async ()=>{
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
  })

  nc.post(new TEvent(["addEvent"]))

  nc.removeAll(sym)
  nc.removeAll(sym)
  nc.removeEvent(sym, TEvent)
  nc.removeAll(sym)
  nc.removeAll(sym)
  nc.removeEvent(sym, TEvent)

  nc.post(new TEvent(["addEvent"]))

  nc.removeAll(sym)
  nc.removeAll(sym)
  nc.removeEvent(sym, TEvent)
  nc.removeAll(sym)
  nc.removeAll(sym)
  nc.removeEvent(sym, TEvent)

  nc.post(new T2Event(["addEvent2"]))
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

  nc.post(new TEvent(["addEvent"]))
  nc.post(new TEvent(["addEvent"]))
  nc.post(new T2Event(["addEvent2"]))
})


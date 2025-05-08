

import {NC} from "../index"
import {UploadProgressChanged, UserInfoChanged} from "./eventForTesting";

test("new NC", ()=>{
  let nc = new NC("new Nc")
  expect(nc.logName).toEqual("new Nc")
})

test("add", async ()=>{
  expect.assertions(1)
  let nc = new NC()

  nc.addEvent(UploadProgressChanged, e => {
    expect(e.ids).toEqual(["1"])
  })
  nc.addEvent(UserInfoChanged, e =>{
    expect(e.ids).toEqual(["1"])
  })

  await nc.post(new UploadProgressChanged(["1"]))
})

test("add&remove", async ()=>{
  expect.assertions(1)
  let nc = new NC()

  let e1 = nc.addEvent(UploadProgressChanged, e => {
    expect(e.ids).toEqual(["1"])
    e1.remove()
  })
  let e2 = nc.addEvent(UserInfoChanged, e =>{
    expect(e.ids).toEqual(["1"])
    e2.remove()
  })

  await nc.post(new UploadProgressChanged(["1"]))
  await nc.post(new UploadProgressChanged(["1"]))
})

async function aFun(): Promise<string> {return ""}

test("add&rm&async", async ()=>{
  expect.assertions(2)
  let nc = new NC()

  let e1 = nc.addEvent(UploadProgressChanged, async e => {
    expect(e.ids).toEqual(["1"])
    await aFun()
    e1.remove()
  })
  nc.addEvent(UserInfoChanged, e =>{
    expect(e.ids).toEqual(["1"])
  })

  await nc.post(new UploadProgressChanged(["1"]))
  await nc.post(new UserInfoChanged(["1"]))
  await nc.post(new UploadProgressChanged(["1"]))
})

test("addMore",  async ()=>{
  expect.assertions(3)
  let nc = new NC()

  nc.addEvent(UploadProgressChanged,  e => {
    expect(e.ids).toEqual(["1"])
  })
  nc.addEvent(UploadProgressChanged, e => {
    expect(e.ids).toEqual(["1"])
  })
  nc.addEvent(UploadProgressChanged, e => {
    expect(e.ids).toEqual(["1"])
  })

  await nc.post(new UploadProgressChanged(["1"]))
  await nc.post(new UserInfoChanged(["1"]))
})

async function aFun2(): Promise<void> {
  return new Promise(resolve => {
    setTimeout(()=>{
      resolve()
    }, 1000)
  })
}

test("add&rm&async-2", async ()=>{
  expect.assertions(3)
  let nc = new NC()

  let e1 = nc.addEvent(UploadProgressChanged, async e => {
    expect(e.ids).toEqual(["1"])
    await aFun2()
    e1.remove()
  })
  nc.addEvent(UploadProgressChanged, e => {
    expect(e.ids).toEqual(["1"])
  })

  await nc.post(new UploadProgressChanged(["1"]))
  await nc.post(new UserInfoChanged(["1"]))
  await nc.post(new UploadProgressChanged(["1"]))
})



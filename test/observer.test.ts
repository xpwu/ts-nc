import {NC, extendNCObserver, NCObserver} from "../index"
import {Built, UploadProgressChanged} from "./eventForTesting";

class ListView {
  all: number[] = []

  add(nc: NC) {
    this.addEventTo(Built, nc,(e) => {
      this.all.push(...e.ids)
    })
  }

  remove(nc: NC) {
    this.removeEventFrom(Built, nc)
  }
}

interface ListView extends NCObserver {}
extendNCObserver(ListView)

test("observer-add", async ()=>{
  let nc1 = new NC()
  let nc2 = new NC()
  let view = new ListView()

  view.add(nc1)
  view.add(nc2)
})

test("observer-remove", async ()=>{
  let nc1 = new NC()
  let nc2 = new NC()
  let view = new ListView()

  view.add(nc1)
  view.add(nc2)

  view.remove(nc1)
  view.remove(nc2)
})

test("observer-remove-all", async ()=>{
  let nc1 = new NC()
  let nc2 = new NC()
  let view = new ListView()

  view.add(nc1)
  view.add(nc2)

  view.removeAll()
})

test("observer-post", async ()=>{
  let nc1 = new NC()
  let nc2 = new NC()
  let view = new ListView()

  view.add(nc1)
  await nc1.post(new Built([1, 3]))
  expect(view.all.length).toEqual(2)
  await nc1.post(new UploadProgressChanged(["2"]))
  expect(view.all.length).toEqual(2)
  await nc2.post(new Built([1, 3]))
  expect(view.all.length).toEqual(2)

  view.add(nc2)
  await nc1.post(new Built([1, 3]))
  expect(view.all.length).toEqual(4)
  await nc1.post(new UploadProgressChanged(["2"]))
  expect(view.all.length).toEqual(4)
  await nc2.post(new Built([1, 3, 0]))
  expect(view.all.length).toEqual(7)
  await nc2.post(new UploadProgressChanged(["20"]))
  expect(view.all.length).toEqual(7)

  view.remove(nc1)
  await nc1.post(new Built([1, 3]))
  expect(view.all.length).toEqual(7)
  await nc1.post(new UploadProgressChanged(["2"]))
  expect(view.all.length).toEqual(7)
  await nc2.post(new Built([1, 3, 0]))
  expect(view.all.length).toEqual(10)
  await nc2.post(new UploadProgressChanged(["20"]))
  expect(view.all.length).toEqual(10)

  view.remove(nc2)
  await nc1.post(new Built([1, 8]))
  expect(view.all.length).toEqual(10)
  await nc1.post(new UploadProgressChanged(["2"]))
  expect(view.all.length).toEqual(10)
  await nc2.post(new Built([1, 3, 0]))
  expect(view.all.length).toEqual(10)
  await nc2.post(new UploadProgressChanged(["20"]))
  expect(view.all.length).toEqual(10)

  view.add(nc1)
  view.add(nc2)
  await nc1.post(new Built([1, 8]))
  expect(view.all.length).toEqual(12)
  await nc1.post(new UploadProgressChanged(["2"]))
  expect(view.all.length).toEqual(12)
  await nc2.post(new Built([1, 3, 0]))
  expect(view.all.length).toEqual(15)
  await nc2.post(new UploadProgressChanged(["20"]))
  expect(view.all.length).toEqual(15)

  view.removeAll()

  await nc1.post(new Built([1, 8]))
  expect(view.all.length).toEqual(15)
  await nc1.post(new UploadProgressChanged(["2"]))
  expect(view.all.length).toEqual(15)
  await nc2.post(new Built([1, 3, 0]))
  expect(view.all.length).toEqual(15)
  await nc2.post(new UploadProgressChanged(["20"]))
  expect(view.all.length).toEqual(15)
})


import {Built, UploadProgressChanged, UserInfoChanged} from "./eventForTesting";

class U2 extends UploadProgressChanged{}

test("event", ()=>{
  expect(UploadProgressChanged.nameSym).toEqual(UploadProgressChanged.nameSym)
  expect(UploadProgressChanged.nameSym).not.toEqual(Built.nameSym)
  expect(UploadProgressChanged.nameSym).not.toEqual(UserInfoChanged.nameSym)
  expect(Built.nameSym).not.toEqual(UserInfoChanged.nameSym)

  let u = new UploadProgressChanged([])
  expect(UploadProgressChanged.nameSym).toEqual(u.nameSym)

  expect(UploadProgressChanged.nameSym.toString()).toEqual("Symbol(UploadProgressChanged)")

  expect(UploadProgressChanged.nameSym).toEqual(U2.nameSym)
})

test("args", ()=>{
  let b = new Built([2])
  expect(b.ids.length).toEqual(1)
  expect(b.ids[0]).toEqual(2)
})
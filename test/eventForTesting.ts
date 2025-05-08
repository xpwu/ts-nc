import {CreateNCEvent} from "../src/event";

export const UploadProgressChanged = CreateNCEvent("UploadProgressChanged")

export const UserInfoChanged = CreateNCEvent()

export const Built = CreateNCEvent<number>()

import { atom } from 'jotai'

export type TimeObject = {
  hour: string
  minute: string
  period: "" | "AM" | "PM"
}

export const startTimeAtom = atom({
  hour: "",
  minute: "",
  period: ""
})

export const endTimeAtom = atom({
  hour: "",
  minute: "",
  period: ""
})
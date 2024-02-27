import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function pad(val: number | string, paddingCount: number): string {
  let v = val
  if (typeof val === "number") {
    v = v.toString()
  }
  const numLength = v.toString().length
  if (numLength < paddingCount) {
    let numberStr = v.toString()
    for (let i = 0; i < paddingCount - numLength; i++) {
      numberStr = "0" + numberStr
    }
    return numberStr
  }
  return v.toString()
}

export function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
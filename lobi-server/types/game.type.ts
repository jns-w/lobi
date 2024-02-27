import {ObjectId} from "mongodb";

interface game {
  name: string
  description: string
  skillLevel: string
  host: ObjectId
  datetime: Date
}

export interface gameInDB extends game {
  _id: ObjectId
}
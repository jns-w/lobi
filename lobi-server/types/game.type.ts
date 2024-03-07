import {ObjectId} from "mongodb";

export interface Game {
  name?: string
  description?: string
  skillLevel?: string
  facilityName?: string
  facilityId?: ObjectId
  hostName?: string
  host?: ObjectId
  contactNumber?: string
  dateTime?: {
    start: string,
    end: string
  }
}

export interface DBGame {
  _id: ObjectId
  name?: string
  description?: string
  skillLevel?: string
  facilityId?: ObjectId
  hostName?: string
  contactNumber?: string
  dateTime: {
    start: Date,
    end: Date
  }
}
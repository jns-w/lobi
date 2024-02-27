import {Context} from "hono";
import {getDb} from "./config";
import {ObjectId} from "mongodb";

export async function getFacilities(ctx: Context) {
  try {
    const res = await getDb()?.collection('facilities')
      .find()
      .project({
        "id": "$_id",
        _id: 0,
        name: 1,
      })
      .toArray();
    return ctx.json({ok: true, data: res})
  } catch (err) {
    console.log(err)
    return ctx.json({ok: false, message: "Something went wrong"})
  }
}

export async function getFacility(ctx: Context) {
  try {
    const id = ctx.req.param("id")
    const res = await getDb()?.collection('facilities')
      .findOne({_id: new ObjectId(id)})
    console.log("res", res)
    return ctx.json({ok: true, data: res})
  } catch (err) {
    console.log(err)
    return ctx.json({ok: false, message: "Something went wrong"})
  }
}
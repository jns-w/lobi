import {getDb} from "./config";
import {Context} from "hono";
import {ObjectId} from "mongodb";
import {parseISO} from "date-fns";
import {Game} from "../types/game.type";

const gameProjection = {
  $project: {
    _id: 0,
    id: "$_id",
    description: 1,
    skillLevel: 1,
    hostName: 1,
    contactNumber: 1,
    dateTime: 1,
    facilityId: 1,
    facility: {
      id: "$facility._id",
      name: "$facility.name",
    },
  },
};

const facilityLookup = {
  $lookup: {
    from: "facilities",
    localField: "facilityId",
    foreignField: "_id",
    as: "facility",
  },
};

const facilitySet = {
  $set: {
    facility: {
      $arrayElemAt: ["$facility", 0],
    },
  },
};

const facilityLookupAndSet = [facilityLookup, facilitySet];

function generateMatchStatement(query: any) {
  let output: any = {
    $match: {
      $and: [],
    },
  };
  const len = Object.keys(query).length;
  if (len === 0) throw new Error("No query params");

  let andArr = [];

  // ID QUERIES
  for (const key in query) {
    if (key.substring(key.length - 2) === "Id") {
      let orArr = [];
      for (let i = 0; i < query[key].length; i++) {
        const id = new ObjectId(query[key][i]);
        orArr.push({[key]: id});
      }
      andArr.push({$or: orArr});
      continue;
    }

    // DATE QUERIES
    if (key === "date") {
      let orArr = [];
      for (let i = 0; i < query[key].length; i++) {
        const date = new Date(parseISO(query[key][i]));
        const dateQuery = {
          $gte: date,
          $lt: new Date(date.getTime() + 24 * 60 * 60 * 1000),
        };
        orArr.push({"dateTime.start": dateQuery});
      }
      andArr.push({$or: orArr});
      continue;
    }

    // NAME QUERIES
    if (key.substring(key.length - 4) === "Name") {
      let orArr = [];
      for (let i = 0; i < query[key].length; i++) {
        orArr.push({[key]: query[key][i]});
      }
      andArr.push({$or: orArr});
      continue;
    }

    // CATCH ALL QUERIES
    let orArr = [];
    for (let i = 0; i < query[key].length; i++) {
      orArr.push({[key]: query[key][i]});
    }
    andArr.push({$or: orArr});
  }
  output.$match.$and = andArr;
  console.log("Match Statement", output);
  return output;
}

export async function getGames(ctx: Context) {
  try {
    const res = await getDb()
      ?.collection("games")
      .aggregate([...facilityLookupAndSet, gameProjection])
      .sort({"dateTime.start": 1})
      .limit(10)
      .toArray();
    return ctx.json({ok: true, data: res});
  } catch (err) {
    console.log("here", err);
    return ctx.json({ok: false, message: "Something went wrong"});
  }
}

export async function getFeaturedGames(ctx: Context) {
  try {
    // algo, random
  } catch (err) {
    console.log(err);
    return ctx.json({ok: false, message: "Something went wrong"});
  }
}

export async function getUpcomingGames(ctx: Context) {
  try {
    const res = await getDb()
      ?.collection("games")
      .aggregate([
        {$match: {"dateTime.start": {$gte: new Date()}}},
        ...facilityLookupAndSet,
        gameProjection,
      ])
      .sort({"dateTime.start": 1})
      .limit(30)
      .toArray();
    return ctx.json({ok: true, data: res});
  } catch (err) {
    console.log(err);
  }
}

export async function insertGame(ctx: Context) {
  try {
    const body: Game = await ctx.req.json();
    const facility = await getDb()
      ?.collection("facilities")
      .findOne({name: body.facilityName});
    console.log(facility?._id);
    if (!facility) throw new Error("Invalid facility");
    if (!body.dateTime) throw new Error("No date time found")
    const game = {
      hostName: body.hostName,
      contactNumber: body.contactNumber,
      description: body.description,
      facilityId: facility._id,
      dateTime: {
        start: new Date(parseISO(body.dateTime.start)),
        end: new Date(parseISO(body.dateTime.end)),
      },
      skillLevel: body.skillLevel,
    };
    const res = await getDb()?.collection("games").insertOne(game);
    return ctx.json({ok: true, data: res});
  } catch (err) {
    console.log(err);
    ctx.status(400);
    return ctx.json({ok: false, message: err});
  }
}

export async function searchGames(ctx: Context) {
  try {
    const query = ctx.req.queries();
    const header = ctx.req.header();
    for (const key in query) {
      if (query[key].length === 0) {
        delete query[key];
      }
    }
    let res;
    // header pagination differentiates a return all and paged search
    if (header.pagination) {
      if (!header.page) throw new Error("No page number");
      if (!header.limit) throw new Error("No limit number found");
      const page = parseInt(header.page);
      const limit = parseInt(header.limit);
      const skip = (page - 1) * limit;
      const data = await getDb()
        ?.collection("games")
        .aggregate([
          {$match: {"dateTime.start": {$gte: new Date()}}}, // filter past games
          generateMatchStatement(query),
          ...facilityLookupAndSet,
          gameProjection,
          {
            $facet:
              {
                items: [{$sort: {"dateTime.start": 1}}, {$skip: skip}, {$limit: limit}],
                itemsCount: [{$count: "count"}]
              },
          },
        ]).toArray()
      if (!data) throw new Error("Something went wrong");
      res = {
        ...data[0],
        itemsCount: data[0].itemsCount[0].count,
        page: page,
        limit: limit,
        pageCount: Math.ceil(data[0].itemsCount[0].count / limit),
      }
    } else {
      const data = await getDb()
        ?.collection("games")
        .aggregate([
          {$match: {"dateTime.start": {$gte: new Date()}}}, // filter past games
          generateMatchStatement(query),
          ...facilityLookupAndSet,
          gameProjection,
        ]).sort({"dateTime.start": 1}).toArray()

      if (!data) throw new Error("Something went wrong");

      res = {
        items: data,
        itemsCount: data.length,
        page: 1,
        limit: data.length,
      }
    }

    return ctx.json({ok: true, data: res});
  } catch (err: any) {
    console.log(err);
    switch (err.message) {
      case "No query params":
        return ctx.json({ok: false, message: "No params found, please check your query"});
      case "No page number":
        return ctx.json({ok: false, message: "Please provide a page number"});
      case "No items per page number":
        return ctx.json({ok: false, message: "Please provide items per page"});
    }
    return ctx.json({ok: false, message: "Something went wrong"});
  }
}

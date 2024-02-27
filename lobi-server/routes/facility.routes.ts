import {Hono} from "hono";
import {getFacilities, getFacility} from "../db/facility-db";

export const facilityRoutes = new Hono()
  .get("/all", getFacilities) // /api/facility/all
  .get("/:id", getFacility) // /api/facility/:id

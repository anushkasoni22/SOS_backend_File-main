import { z } from "zod";
import { Request } from "express";

/**
 * Zod schema for validating upload request body
 */
export const requestsSchema = z.object({
  name: z.string().optional(),
  mobile: z.string().optional(),
  image_url: z.string(),
  device_id:z.string(),
  request_type :z.enum(["fire","medical","police"]),
  longitude:z.number(),
  latitude:z.number(),
  image_classification:z.string().optional(),
  radius:z.number().optional()
});
export const getRequestSchema=z.object({
  stationType:z.enum(["fire","medical","police"])  
});
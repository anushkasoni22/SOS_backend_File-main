import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

// Middleware to validate request with Zod schema
export const validateRequest =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Parse and validate the request body
      schema.parse(req.body);
      console.log("reach")
      next(); // If valid, proceed to the next middleware/controller
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ errors: error.errors }); // Send validation errors
      } else {
        
        res.status(500).json({ error: "Internal server error" });
      }
    }
  };
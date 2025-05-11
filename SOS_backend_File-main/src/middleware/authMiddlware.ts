import { Request, Response, NextFunction } from "express";
import { supabase } from "../config/supabase";
export interface AuthRequest extends Request {
  user?: any;
}
export const checkAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token: string|undefined = req.headers.authorization;
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const realToken=token.split(" ")[1];

  const { data: user, error } = await supabase.auth.getUser(realToken);
  if (error || !user) {
    res.status(401).json({ error: "Invalid Token" });
    return;
  }
  req.user = user.user;
  next();
};
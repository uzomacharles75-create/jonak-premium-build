import bcrypt from "bcrypt";
import { z } from "zod";
import type { Request, Response } from "express";

import { cookieOptions, env } from "../config/env";
import { UserModel } from "../models/User";
import { signAuthToken, type AuthenticatedRequest } from "../middleware/auth";
import { HttpError } from "../utils/http-error";

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8).max(128),
});

export function serializeUser(user: {
  _id?: unknown;
  id?: unknown;
  name: string;
  email: string;
  role: string;
}) {
  return {
    id: String(user._id ?? user.id),
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export async function login(req: Request, res: Response) {
  const payload = loginSchema.parse(req.body);
  const email = payload.email.toLowerCase();

  const user = await UserModel.findOne({ email, isActive: true }).select("+passwordHash");
  if (!user) {
    throw new HttpError(401, "Invalid email or password");
  }

  const passwordMatches = await bcrypt.compare(payload.password, user.passwordHash);
  if (!passwordMatches) {
    throw new HttpError(401, "Invalid email or password");
  }

  const token = signAuthToken({
    userId: String(user._id),
    email: user.email,
    name: user.name,
    role: "admin",
  });

  res.cookie(env.AUTH_COOKIE_NAME, token, cookieOptions);
  res.json({
    user: serializeUser(user),
  });
}

export async function currentUser(req: AuthenticatedRequest, res: Response) {
  if (!req.authUser) {
    throw new HttpError(401, "Authentication required");
  }

  res.json({
    user: req.authUser,
  });
}

export async function logout(_req: Request, res: Response) {
  res.clearCookie(env.AUTH_COOKIE_NAME, {
    ...cookieOptions,
    maxAge: 0,
  });

  res.json({ message: "Logged out" });
}

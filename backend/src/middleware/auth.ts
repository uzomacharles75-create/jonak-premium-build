import jwt, { type JwtPayload } from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";

import { cookieOptions, env } from "../config/env";
import { UserModel } from "../models/User";
import { HttpError } from "../utils/http-error";

export type AuthRole = "admin";

export type AuthTokenPayload = JwtPayload & {
  userId: string;
  email: string;
  name: string;
  role: AuthRole;
};

export type AuthenticatedRequest = Request & {
  authUser?: {
    userId: string;
    email: string;
    name: string;
    role: AuthRole;
  };
};

export function signAuthToken(payload: AuthTokenPayload) {
  return jwt.sign(payload, env.JWT_SECRET as jwt.Secret, {
    expiresIn: env.ADMIN_TOKEN_TTL as jwt.SignOptions["expiresIn"],
  });
}

export function readAuthToken(req: Request) {
  const cookieToken = req.cookies?.[env.AUTH_COOKIE_NAME];
  if (typeof cookieToken === "string" && cookieToken.length > 0) {
    return cookieToken;
  }

  const authHeader = req.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.slice("Bearer ".length).trim();
  return token.length > 0 ? token : null;
}

export async function authenticateRequest(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
) {
  try {
    const token = readAuthToken(req);
    if (!token) {
      throw new HttpError(401, "Authentication required");
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload;
    if (!decoded?.userId) {
      throw new HttpError(401, "Invalid authentication token");
    }

    const user = await UserModel.findById(decoded.userId).select("name email role isActive").lean();
    if (!user || !user.isActive || user.role !== "admin") {
      throw new HttpError(401, "Authentication required");
    }

    req.authUser = {
      userId: String(user._id),
      email: user.email,
      name: user.name,
      role: user.role,
    };

    next();
  } catch (error) {
    next(error);
  }
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  void authenticateRequest(req, res, next);
}

export function authCookieClearOptions() {
  return { ...cookieOptions, maxAge: 0 };
}

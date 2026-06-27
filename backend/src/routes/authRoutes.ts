import { Router } from "express";

import { authLimiter } from "../middleware/rate-limit";
import { requireAuth } from "../middleware/auth";
import { login, currentUser, logout } from "../controllers/authController";
import { asyncHandler } from "../utils/async-handler";

export const authRoutes = Router();

authRoutes.post("/login", authLimiter, asyncHandler(login));
authRoutes.post("/logout", asyncHandler(logout));
authRoutes.get("/me", requireAuth, asyncHandler(currentUser));

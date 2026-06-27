import { Router } from "express";

import { asyncHandler } from "../utils/async-handler";
import { getPublicProduct, listPublicProducts } from "../controllers/productController";

export const publicProductRoutes = Router();

publicProductRoutes.get("/", asyncHandler(listPublicProducts));
publicProductRoutes.get("/:slug", asyncHandler(getPublicProduct));

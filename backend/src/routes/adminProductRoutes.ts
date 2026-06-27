import { Router } from "express";

import { asyncHandler } from "../utils/async-handler";
import { requireAuth } from "../middleware/auth";
import {
  createProduct,
  deleteProduct,
  getAdminProduct,
  listAdminProducts,
  updateProduct,
} from "../controllers/productController";

export const adminProductRoutes = Router();

adminProductRoutes.use(requireAuth);
adminProductRoutes.get("/", asyncHandler(listAdminProducts));
adminProductRoutes.get("/:id", asyncHandler(getAdminProduct));
adminProductRoutes.post("/", asyncHandler(createProduct));
adminProductRoutes.patch("/:id", asyncHandler(updateProduct));
adminProductRoutes.delete("/:id", asyncHandler(deleteProduct));

import { Router } from "express";

import { authRoutes } from "./authRoutes";
import { mediaRoutes } from "./mediaRoutes";
import { publicProductRoutes } from "./publicProductRoutes";
import { adminProductRoutes } from "./adminProductRoutes";
import { adminMediaRoutes } from "./adminMediaRoutes";

export const apiRoutes = Router();

apiRoutes.use("/auth", authRoutes);
apiRoutes.use("/products", publicProductRoutes);
apiRoutes.use("/media", mediaRoutes);
apiRoutes.use("/admin/products", adminProductRoutes);
apiRoutes.use("/admin/media", adminMediaRoutes);

import { Router } from "express";
import { CategoryRoutes, ProductRoutes } from "@/presentation";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    // Definir las rutas
    router.use("/api/categories", CategoryRoutes.routes);
    router.use("/api/products", ProductRoutes.routes);

    return router;
  }
}

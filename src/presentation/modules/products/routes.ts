// src/routes/ProductRoutes.ts
import { ProductController, ProductoService } from "@/presentation";
import { Router } from "express";

export class ProductRoutes {
  static get routes(): Router {
    const router = Router();
    const service = new ProductoService();
    const controller = new ProductController(service);

    router.get("/", controller.getAll);
    router.get("/search", controller.search); // /api/products/search?query=bar
    router.get("/:id", controller.getById); // /api/products/456

    return router;
  }
}

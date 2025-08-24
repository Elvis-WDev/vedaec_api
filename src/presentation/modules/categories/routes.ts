// src/routes/CategoryRoutes.ts
import { CategoriaService, CategoryController } from "@/presentation";
import { Router } from "express";

export class CategoryRoutes {
  static get routes(): Router {
    const router = Router();
    const service = new CategoriaService();
    const controller = new CategoryController(service);

    router.get("/", controller.getAll);
    router.get("/search", controller.search);
    router.get("/:id", controller.getById);

    return router;
  }
}

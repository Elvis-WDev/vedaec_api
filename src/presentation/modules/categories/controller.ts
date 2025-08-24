// src/presentations/controllers/CategoryController.ts
import { Request, Response } from "express";
import { handleError } from "@/domain";
import { PaginationDto } from "@/utils";
import { CategoriaService } from "@/presentation";

export class CategoryController {
  constructor(private readonly categoryService: CategoriaService) {}

  /** GET /api/categories?page=&limit= */
  getAll = (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const pagination: PaginationDto = { page, limit };

    this.categoryService
      .getAllCategories(pagination)
      .then((result) => res.json(result))
      .catch((err) => handleError(err, res));
  };

  /** GET /api/categories/search?query=&page=&limit= */
  search = (req: Request, res: Response) => {
    const query = (req.query.query as string) || "";
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const pagination: PaginationDto = { page, limit };

    this.categoryService
      .searchCategories(query, pagination)
      .then((result) => res.json(result))
      .catch((err) => handleError(err, res));
  };

  /** GET /api/categories/:id */
  getById = (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid id parameter" });
      return;
    }

    this.categoryService
      .getCategoryById(id)
      .then((entity) => res.json(entity))
      .catch((err) => handleError(err, res));
  };
}

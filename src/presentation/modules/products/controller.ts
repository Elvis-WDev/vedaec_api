// src/presentations/controllers/ProductController.ts
import { Request, Response } from "express";
import { PaginationDto } from "@/utils";
import { handleError } from "@/domain";
import { ProductoService } from "@/presentation/services/products.service";

export class ProductController {
  constructor(private readonly productService: ProductoService) {}

  /** GET /api/products?page=&limit= */
  public getAll = (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const pagination: PaginationDto = { page, limit };

    this.productService
      .getAllProducts(pagination)
      .then((result) => res.json(result))
      .catch((err) => handleError(err, res));
  };

  /** GET /api/products/search?query=&page=&limit= */
  public search = (req: Request, res: Response) => {
    const query = (req.query.query as string) || "";
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const pagination: PaginationDto = { page, limit };

    this.productService
      .searchProducts(query, pagination)
      .then((result) => res.json(result))
      .catch((err) => handleError(err, res));
  };

  /** GET /api/products/:id */
  public getById = (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid product ID" });
      return;
    }

    this.productService
      .getProductById(id)
      .then((entity) => res.json(entity))
      .catch((err) => handleError(err, res));
  };
}

// src/services/CategoriaService.ts
import { prisma } from "@/data";
import { CategoriaEntity, CustomError } from "@/domain";
import { PaginationDto, Categoria } from "@/utils";

export interface PaginatedCategories {
  page: number;
  limit: number;
  total: number;
  next: string | null;
  prev: string | null;
  categories: CategoriaEntity[];
}

export class CategoriaService {
  constructor() {}

  /**
   * Devuelve un listado paginado de categorías
   */
  public async getAllCategories(
    pagination: PaginationDto
  ): Promise<PaginatedCategories> {
    const { page, limit } = pagination;

    try {
      const [total, rows] = await Promise.all([
        prisma.categorias.count(),
        prisma.categorias.findMany({
          skip: (page - 1) * limit,
          take: limit,
        }),
      ]);

      const categories = rows.map((category: Categoria) =>
        CategoriaEntity.fromObject(category)
      );
      const hasNext = page * limit < total;

      return {
        page,
        limit,
        total,
        next: hasNext
          ? `/api/categories?page=${page + 1}&limit=${limit}`
          : null,
        prev:
          page > 1 ? `/api/categories?page=${page - 1}&limit=${limit}` : null,
        categories,
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  /**
   * Búsqueda en múltiples atributos: id_category, categoria o fecha exacta
   */
  public async searchCategories(
    query: string,
    pagination: PaginationDto
  ): Promise<PaginatedCategories> {
    const { page, limit } = pagination;

    const qNum = Number(query);
    const qDate = new Date(query);
    const isDate = !isNaN(qDate.getTime());

    const orFilters: any[] = [{ categoria: { contains: query } }];
    if (!isNaN(qNum)) {
      orFilters.push({ id_category: qNum });
    }
    if (isDate) {
      orFilters.push({ fecha: qDate });
    }

    try {
      const [total, rows] = await Promise.all([
        prisma.categorias.count({ where: { OR: orFilters } }),
        prisma.categorias.findMany({
          where: { OR: orFilters },
          skip: (page - 1) * limit,
          take: limit,
        }),
      ]);

      const categories = rows.map((category: Categoria) =>
        CategoriaEntity.fromObject(category)
      );
      const hasNext = page * limit < total;

      return {
        page,
        limit,
        total,
        next: hasNext
          ? `/api/categories/search?query=${encodeURIComponent(query)}&page=${
              page + 1
            }&limit=${limit}`
          : null,
        prev:
          page > 1
            ? `/api/categories/search?query=${encodeURIComponent(query)}&page=${
                page - 1
              }&limit=${limit}`
            : null,
        categories,
      };
    } catch (err) {
      throw CustomError.internalServer(`${err}`);
    }
  }

  public async getCategoryById(id: number): Promise<CategoriaEntity> {
    if (isNaN(id)) {
      throw CustomError.badRequest("Invalid category ID");
    }

    try {
      const row = await prisma.categorias.findUnique({
        where: { id_category: id },
      });
      if (!row) {
        throw CustomError.notFound("Category not found");
      }
      return CategoriaEntity.fromObject(row);
    } catch (error) {
      // Si el error ya es un CustomError, lo propagamos; si no, es interno
      if (error instanceof CustomError) throw error;
      throw CustomError.internalServer(`${error}`);
    }
  }
}

// src/services/ProductoService.ts
import { prisma } from "@/data";
import { CustomError, ProductoEntity } from "@/domain";
import { PaginationDto, Producto } from "@/utils";

export interface PaginatedProducts {
  page: number;
  limit: number;
  total: number;
  next: string | null;
  prev: string | null;
  products: ProductoEntity[];
}

export class ProductoService {
  constructor() {}

  /**
   * Devuelve un listado paginado de productos
   */
  public async getAllProducts(
    pagination: PaginationDto
  ): Promise<PaginatedProducts> {
    const { page, limit } = pagination;

    try {
      const [total, rows] = await Promise.all([
        prisma.productos.count(),
        prisma.productos.findMany({
          skip: (page - 1) * limit,
          take: limit,
        }),
      ]);

      const products = rows.map((r: Producto) => ProductoEntity.fromObject(r));
      const hasNext = page * limit < total;

      return {
        page,
        limit,
        total,
        next: hasNext ? `/api/products?page=${page + 1}&limit=${limit}` : null,
        prev: page > 1 ? `/api/products?page=${page - 1}&limit=${limit}` : null,
        products,
      };
    } catch (err) {
      throw CustomError.internalServer("Internal Server Error");
    }
  }

  /**
   * Búsqueda en múltiples atributos:
   * id_producto, id_category, codigo, descripcion, URLs, números o fecha
   */
  public async searchProducts(
    query: string,
    pagination: PaginationDto
  ): Promise<PaginatedProducts> {
    const { page, limit } = pagination;

    const qNum = Number(query);
    const qDate = new Date(query);
    const isDate = !isNaN(qDate.getTime());

    const orFilters: any[] = [
      { codigo_producto: { contains: query } },
      { descripcion_producto: { contains: query } },
      { url_img_producto: { contains: query } },
    ];
    if (!isNaN(qNum)) {
      orFilters.push(
        { id_producto: qNum },
        { id_category: qNum },
        { stock_producto: qNum },
        { ventas_producto: qNum },
        { precio_compra_producto: qNum },
        { precio_venta_producto: qNum }
      );
    }
    if (isDate) {
      orFilters.push({ fecha: qDate });
    }

    try {
      const [total, rows] = await Promise.all([
        prisma.productos.count({ where: { OR: orFilters } }),
        prisma.productos.findMany({
          where: { OR: orFilters },
          skip: (page - 1) * limit,
          take: limit,
        }),
      ]);

      const products = rows.map((r: Producto) => ProductoEntity.fromObject(r));
      const hasNext = page * limit < total;

      return {
        page,
        limit,
        total,
        next: hasNext
          ? `/api/products/search?query=${encodeURIComponent(query)}&page=${
              page + 1
            }&limit=${limit}`
          : null,
        prev:
          page > 1
            ? `/api/products/search?query=${encodeURIComponent(query)}&page=${
                page - 1
              }&limit=${limit}`
            : null,
        products,
      };
    } catch (err) {
      throw CustomError.internalServer("Internal Server Error");
    }
  }
  public async getProductById(id: number): Promise<ProductoEntity> {
    if (isNaN(id)) {
      throw CustomError.badRequest("Invalid product ID");
    }

    try {
      const row = await prisma.productos.findUnique({
        where: { id_producto: id },
      });
      if (!row) {
        throw CustomError.notFound("Product not found");
      }
      return ProductoEntity.fromObject(row);
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw CustomError.internalServer(`${error}`);
    }
  }
}

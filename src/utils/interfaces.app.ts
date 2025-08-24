export interface PaginationDto {
  page: number;
  limit: number;
}

export interface Categoria {
  id_category: number;
  categoria: string;
  fecha: Date;
  productos?: Producto[];
}

export interface Producto {
  id_producto: number;
  id_category: number;
  codigo_producto: string;
  descripcion_producto: string;
  url_img_producto: string | null;
  stock_producto: number | null;
  precio_compra_producto: number;
  precio_venta_producto: number;
  ventas_producto: number | null;
  fecha: Date;
  categorias?: Categoria;
}

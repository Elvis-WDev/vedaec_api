import { CustomError } from "@/domain";
import { envs } from "@/config";

export class ProductoEntity {
  constructor(
    public id_producto: number,
    public id_category: number,
    public codigo_producto: string,
    public descripcion_producto: string,
    public url_img_producto: string,
    public stock_producto: number,
    public precio_compra_producto: number,
    public precio_venta_producto: number,
    public ventas_producto: number,
    public fecha: Date
  ) {}

  static fromObject(object: { [key: string]: any }): ProductoEntity {
    const {
      id_producto,
      id_category,
      codigo_producto,
      descripcion_producto,
      url_img_producto,
      stock_producto,
      precio_compra_producto,
      precio_venta_producto,
      ventas_producto,
      fecha,
    } = object;

    if (id_producto === undefined)
      throw CustomError.badRequest("Missing id_producto");
    if (id_category === undefined)
      throw CustomError.badRequest("Missing id_category");
    if (!codigo_producto)
      throw CustomError.badRequest("Missing codigo_producto");
    if (!descripcion_producto)
      throw CustomError.badRequest("Missing descripcion_producto");
    if (!url_img_producto)
      throw CustomError.badRequest("Missing url_img_producto");
    if (stock_producto === undefined)
      throw CustomError.badRequest("Missing stock_producto");
    if (precio_compra_producto === undefined)
      throw CustomError.badRequest("Missing precio_compra_producto");
    if (precio_venta_producto === undefined)
      throw CustomError.badRequest("Missing precio_venta_producto");
    if (ventas_producto === undefined)
      throw CustomError.badRequest("Missing ventas_producto");
    if (!fecha) throw CustomError.badRequest("Missing fecha");

    const parsedDate = new Date(fecha);
    if (isNaN(parsedDate.getTime()))
      throw CustomError.badRequest("Invalid fecha");

    return new ProductoEntity(
      id_producto,
      id_category,
      codigo_producto,
      descripcion_producto,
      envs.HOST_FORNTEND + url_img_producto,
      stock_producto,
      precio_compra_producto,
      precio_venta_producto,
      ventas_producto,
      parsedDate
    );
  }
}

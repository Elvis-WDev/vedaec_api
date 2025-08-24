// src/entities/CategoriaEntity.ts
import { CustomError } from "../";

export class CategoriaEntity {
  constructor(
    public id_category: number,
    public categoria: string,
    public fecha: Date
  ) {}

  static fromObject(object: { [key: string]: any }): CategoriaEntity {
    const { id_category, categoria, fecha } = object;

    if (id_category === undefined)
      throw CustomError.badRequest("Missing id_category");
    if (!categoria) throw CustomError.badRequest("Missing categoria");
    if (!fecha) throw CustomError.badRequest("Missing fecha");

    const parsedDate = new Date(fecha);
    if (isNaN(parsedDate.getTime()))
      throw CustomError.badRequest("Invalid fecha");

    return new CategoriaEntity(id_category, categoria, parsedDate);
  }
}

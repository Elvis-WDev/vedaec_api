import "dotenv/config";
import { get } from "env-var";

export const envs = {
  PORT: get("PORT").required().asPortNumber(),

  MYSQL_URI: get("MYSQL_URI").required().asString(),
  MYSQL_HOST: get("MYSQL_HOST").required().asString(),
  MYSQL_USER: get("MYSQL_USER").required().asString(),
  MYSQL_DB: get("MYSQL_DB").required().asString(),
  MYSQL_PASSWORD: get("MYSQL_PASSWORD").required().asString(),

  HOST_FORNTEND: get("HOST_FORNTEND").required().asString(),
};

import { envs } from "@/config";
import { prisma } from "@/data";
import { AppRoutes, Server } from "@/presentation";

(async () => {
  main();
})();

async function main() {
  // PostgreSQL connection
  await prisma.$connect();

  // Starting server
  const server = new Server({
    port: envs.PORT,
    routes: AppRoutes.routes,
  });

  server.start();
}

import { envs } from './config/envs';
import { prisma } from './data';
import { AppRoutes } from './presentation/routes';
import { Server } from './presentation/server';


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


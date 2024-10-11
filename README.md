# User Login/Register API REST (Express + TypeScript + PostgreSQL) Template

Este proyecto previamente inicializado tiene todo lo necesario para trabajar con TypeScript, Express y Rest.

## Instalación

1. Clonar el repositorio `git clone https://github.com/Elvis-WDev/Login-Register-API-REST-Express-TypeScript-PostgreSQL-Template.git`

2. Clonar .env.template a .env y configurar las variables de entorno
 
 ```sh
    PORT=3000

    POSTGRES_URL="postgresql://postgres:123456@localhost:5432/myauth"
    POSTGRES_USER=postgres
    POSTGRES_DB=myauth
    POSTGRES_PASSWORD=123456

    JWT_SEED=cualquier_cosa
  ```

3. Ejecutar `npm install` para instalar las dependencias

4. Configurar el docker-compose.yml, las variables de entorno se configuran en .env

```sh
    version: '3.8'

    services:

        postgres-db:
            image: postgres:15.3
            restart: always
            environment:
                POSTGRES_USER: ${POSTGRES_USER}
                POSTGRES_DB: ${POSTGRES_DB}
                POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
            volumes:
            - ./postgres:/var/lib/postgresql/data
            ports:
            - 5432:5432
```
5. Ejecutar `docker-compose up -d` para levantar los servicios deseados.

6. Ejecutar `npx prisma migrate dev --name init` para migrar tablas a la base de datos.

7. Ejecutar `npm run dev` para levantar el proyecto en modo desarrollo.

7. Abrir el naevgador en `localhost:3000`
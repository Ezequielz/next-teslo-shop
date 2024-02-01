# Teslo | shop
__Ecomerce clon de Tesla, del curso de [Fernando Herrera Next 14](https://cursos.devtalles.com/courses/nextjs)__

<img src="https://res.cloudinary.com/zapataezequiel/image/upload/v1704296629/Sin_t%C3%ADtulo_zhrzeb.jpg" />


## Correr en dev

1. Clonar el repositorio.
2. Instalar dependencias ```npm install```
3. Crear una copia del ***.env.template*** renombrarlo a ***.env*** y cambiar las variables de entorno.
4. levantar la base de datos ```docker compose up -d```
5. Correr las migraciones de [Prisma](https://www.prisma.io/) ```npx prisma migrate dev```
6. Ejecutar seed ```npm run seed```
7. Limpiar el localStorage del navegador
8. Correr el proyecto ```npm run dev```

## Correr en prod
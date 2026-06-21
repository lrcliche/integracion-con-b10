## Prueba de Integración Continua

Cambio realizado para validar la ejecución del workflow en una rama de desarrollo.
# Proyecto de Software basado en herramientas de Integracion Continua

## DevStore CI - Tienda Online de Elementos de Desarrollo e Informatica

## Descripcion

DevStore CI es un proyecto academico de Integracion Continua que implementa una tienda online basica de elementos de desarrollo e informatica. La solucion esta planteada con un backend desarrollado en Go, un frontend en React/Vite, una base de datos PostgreSQL y contenedores Docker comunicados entre si.

El flujo principal del sistema permite consultar productos disponibles desde una API REST y visualizarlos desde una interfaz web.

## Objetivo general

Implementar una solucion base usando Docker para demostrar la comunicacion entre servicios dentro de un entorno de integracion continua.

## Tecnologias

- Go
- React
- Vite
- TypeScript
- PostgreSQL
- Docker
- Docker Compose
- GitHub

## Arquitectura general

La arquitectura general del sistema sigue una comunicacion simple entre tres servicios:

```txt
frontend -> backend -> postgres
```

- El frontend consume los endpoints expuestos por el backend.
- El backend implementa la API REST y la logica de consulta de productos.
- PostgreSQL almacena la informacion de los productos de la tienda.

## Estructura del proyecto

```txt
.
|-- README.md
|-- backend
|   |-- README.md
|   |-- go.mod
|   |-- go.sum
|   |-- Makefile
|   |-- LICENSE
|   |-- application
|   |   |-- config
|   |   `-- services
|   |-- cmd
|   |   `-- api
|   |-- docs
|   |-- domain
|   |   |-- entities
|   |   `-- ports
|   |-- infrastructure
|   |   `-- repositories
|   `-- presentation
|       |-- container
|       |-- errors
|       |-- handlers
|       |-- middleware
|       |-- responses
|       |-- routes
|       `-- server
|-- frontend
|   |-- Dockerfile
|   |-- package.json
|   |-- vite.config.ts
|   `-- src
|       |-- App.tsx
|       |-- components
|       |-- services
|       `-- types
`-- database
    `-- init.sql
```

## Contenedores

| Servicio | Tecnologia | Puerto | Descripcion |
|---|---|---:|---|
| frontend | React/Vite | 5173 | Interfaz de tienda |
| backend | Go | 8080 | API REST |
| postgres | PostgreSQL | 5432 | Base de datos |

## Frontend

La interfaz esta en `frontend/` y consume `GET /api/products` del backend. Usa Vite con proxy para evitar problemas de CORS sin modificar el backend.

### Variables de entorno

| Variable | Uso |
|---|---|
| `VITE_API_URL` | URL base del API. Dejar vacio para usar el proxy de Vite (recomendado). |
| `VITE_PROXY_TARGET` | Destino del proxy en runtime (`http://backend:8080` en Docker). |

Copiar el ejemplo:

```bash
cd frontend
cp .env.example .env
```

### Desarrollo local (sin Docker)

Con el backend en el puerto 8080:

```bash
cd frontend
npm install
npm run dev
```

Abrir <http://localhost:5173>.

### Servicio en Docker Compose

Fragmento para integrar en `docker-compose.yml`:

```yaml
frontend:
  build: ./frontend
  ports:
    - "5173:5173"
  environment:
    VITE_PROXY_TARGET: http://backend:8080
    VITE_API_URL: ""
  depends_on:
    - backend
```

## Ejecucion

Desde la raiz del proyecto:

```bash
docker compose up --build
```

## Instalacion local en Windows

Para ejecutar el proyecto sin Docker Compose en Windows, seguir el manual:

- [Installation.local.md](Installation.local.md)

El manual incluye dependencias requeridas, preparacion de `.env`, PostgreSQL local o con Docker, inicio del backend Go, inicio del frontend Vite y validaciones.

## Validacion

Una vez levantados los servicios, se pueden validar los siguientes recursos:

- Frontend: <http://localhost:5173>
- Healthcheck del backend: <http://localhost:8080/health>
- Listado de productos: <http://localhost:8080/api/products>

## Endpoints

| Metodo | Ruta | Descripcion |
|---|---|---|
| GET | `/health` | Verifica el estado del backend |
| GET | `/api/products` | Retorna el listado de productos |

## Division de tareas

| Integrante | Responsabilidad |
|---|---|
| PULIDO BARRETO JEISSON DAVID| Backend Go y arquitectura hexagonal |
| FRANYELI MENDIBLE CASTRO | Base de datos PostgreSQL |
| DIEGO ARMANDO PREGONERO JIMÉNEZ | Frontend React/Vite |
| LUIS RAMOS QUESADA | Docker y Docker Compose |
| MAICOL YOJAN VEGA LISCANO  | Documentacion, pruebas y evidencias |

## Evidencias sugeridas

- Captura del repositorio en GitHub.
- Captura de la ejecucion de `docker compose up`.
- Captura de `docker ps` con los contenedores activos.
- Captura del endpoint `/health`.
- Captura del endpoint `/api/products`.
- Captura del frontend mostrando productos.

## Base de datos

El archivo `database/init.sql` inicializa la base de datos PostgreSQL con la tabla `products` y datos de prueba para la tienda. Este script permite contar con informacion inicial para validar la comunicacion entre la base de datos, el backend y el frontend.

## Conclusion

El proyecto demuestra el uso de contenedores Docker comunicados entre si como base para procesos posteriores de integracion continua. La separacion entre frontend, backend y base de datos facilita la validacion de servicios, la ejecucion local del sistema y la preparacion de futuras etapas de automatizacion con GitHub Actions.

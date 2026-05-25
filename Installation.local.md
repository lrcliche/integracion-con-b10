# Instalacion local en Windows

Manual para levantar el proyecto completo en Windows usando PowerShell: PostgreSQL, backend Go y frontend React/Vite.

## 1. Dependencias requeridas

Instalar y verificar estas herramientas:

| Herramienta | Version recomendada | Uso |
|---|---:|---|
| Git | 2.x | Clonar y versionar el repositorio |
| Go | 1.23 o superior | Ejecutar el backend |
| Node.js | 18 o superior | Ejecutar el frontend Vite |
| npm | Incluido con Node.js | Instalar dependencias frontend |
| PostgreSQL | 15 o superior | Base de datos local |
| Docker Desktop | Opcional | Alternativa rapida para PostgreSQL |

Verificar desde PowerShell:

```powershell
git --version
go version
node --version
npm --version
psql --version
docker --version
```

Si `psql` no se reconoce despues de instalar PostgreSQL, agregar la carpeta `bin` de PostgreSQL al `PATH`. Ejemplo comun:

```powershell
C:\Program Files\PostgreSQL\16\bin
```

## 2. Clonar y entrar al proyecto

```powershell
git clone <URL_DEL_REPOSITORIO>
cd integracion-con-b10
```

Si ya tienes el repositorio:

```powershell
cd L:\Proyectos\Uni\poli\integracion-con-b10
```

## 3. Preparar variables de entorno

No subir archivos `.env` al repositorio. Usar los ejemplos versionados.

Backend:

```powershell
Copy-Item backend\.env.example backend\.env
```

Frontend:

```powershell
Copy-Item frontend\.env.example frontend\.env
```

Para ejecucion local con PostgreSQL instalado en Windows, ajustar `backend\.env`:

```env
APP_ENV=development
APP_PORT=8080
READ_TIMEOUT_SECONDS=10
WRITE_TIMEOUT_SECONDS=10

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=integration_store
DB_SSLMODE=disable
```

Si tu usuario o password local de PostgreSQL es diferente, cambiar solo `DB_USER` y `DB_PASSWORD`.

## 4. Crear la base de datos

Opcion A: PostgreSQL instalado en Windows.

Crear la base:

```powershell
createdb -U postgres integration_store
```

Cargar datos iniciales:

```powershell
psql -U postgres -d integration_store -f database\init.sql
```

Si `createdb` falla porque la base ya existe, continuar con el comando `psql`.

Opcion B: PostgreSQL con Docker Desktop.

```powershell
docker run --name devstore-postgres `
  -e POSTGRES_USER=postgres `
  -e POSTGRES_PASSWORD=postgres `
  -e POSTGRES_DB=integration_store `
  -p 5432:5432 `
  -d postgres:16
```

Cargar datos iniciales:

```powershell
docker cp database\init.sql devstore-postgres:/init.sql
docker exec -it devstore-postgres psql -U postgres -d integration_store -f /init.sql
```

Para detener o iniciar este contenedor:

```powershell
docker stop devstore-postgres
docker start devstore-postgres
```

## 5. Instalar y ejecutar backend

Instalar dependencias Go:

```powershell
cd backend
go mod download
```

Ejecutar backend:

```powershell
go run .\cmd\api
```

El backend queda disponible en:

```txt
http://localhost:8080
```

Validar en otra terminal:

```powershell
Invoke-RestMethod http://localhost:8080/health
Invoke-RestMethod http://localhost:8080/api/products
```

Para compilar:

```powershell
go build -o bin\api.exe .\cmd\api
```

Para ejecutar pruebas:

```powershell
go test ./...
```

## 6. Instalar y ejecutar frontend

Abrir otra terminal PowerShell desde la raiz del proyecto:

```powershell
cd L:\Proyectos\Uni\poli\integracion-con-b10\frontend
npm install
npm run dev
```

El frontend queda disponible en:

```txt
http://localhost:5173
```

Por defecto, Vite envia `/api` y `/health` al backend local `http://localhost:8080`, asi que `VITE_API_URL` puede quedar vacio.

Para compilar el frontend:

```powershell
npm run build
```

Para previsualizar la compilacion:

```powershell
npm run preview
```

## 7. Orden recomendado de inicio

1. Iniciar PostgreSQL.
2. Cargar `database\init.sql` si la base esta vacia.
3. Ejecutar backend en `backend\` con `go run .\cmd\api`.
4. Ejecutar frontend en `frontend\` con `npm run dev`.
5. Abrir `http://localhost:5173`.

## 8. Validaciones rapidas

Backend:

```powershell
Invoke-RestMethod http://localhost:8080/health
Invoke-RestMethod http://localhost:8080/api/products
```

Frontend:

```powershell
cd frontend
npm run build
```

Backend:

```powershell
cd backend
go test ./...
```

## 9. Problemas comunes

### El backend no conecta a PostgreSQL

Revisar `backend\.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=integration_store
```

Validar conexion:

```powershell
psql -U postgres -h localhost -d integration_store
```

### El puerto 8080 esta ocupado

Cambiar en `backend\.env`:

```env
APP_PORT=8081
```

Si cambias el puerto del backend, tambien actualizar el destino del proxy del frontend:

```powershell
$env:VITE_PROXY_TARGET="http://localhost:8081"
npm run dev
```

### El puerto 5173 esta ocupado

Vite puede sugerir otro puerto automaticamente. Si necesitas forzar uno distinto:

```powershell
npm run dev -- --port 5174
```

### PowerShell bloquea scripts de npm

Ejecutar los comandos con `npm.cmd`:

```powershell
npm.cmd install
npm.cmd run dev
```

### Cambios en `.env` no se aplican

Detener y volver a iniciar el backend o frontend. Las variables se cargan al inicio del proceso.

## 10. Archivos importantes

| Archivo | Uso |
|---|---|
| `backend\.env.example` | Plantilla de variables del backend |
| `frontend\.env.example` | Plantilla de variables del frontend |
| `database\init.sql` | Script inicial de PostgreSQL |
| `backend\cmd\api\main.go` | Entrada del backend |
| `frontend\vite.config.ts` | Proxy local de Vite |
| `.gitignore` | Evita subir `.env` y otros archivos locales |

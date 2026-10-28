# Reto Evaluable - Venue Control

## Resultado

Se ha implementado el módulo de gestión de espacios (Venue Control) con TypeScript en el backend y React Native (Expo Web) en el cliente.
El backend proporciona 6 funciones Lambda para las operaciones CRUD sobre `/zones`, funcionando tanto en local con `serverless-offline` como desplegado en AWS API Gateway y Lambda.
La app móvil cuenta con las 4 vistas requeridas (Listado, Detalle, Nuevo y Editar) y selector de entorno para probar contra local o la nube.

## Contrato de datos

Cada espacio (`Zone`) sigue el contrato:

```json
{
  "id": "ZONE-01",
  "name": "Main Stage",
  "capacity": 5000,
  "status": "OPEN"
}
```

Estados permitidos: `OPEN`, `FULL`, `CLOSED`.

## Rutas del Backend

- `GET /zones`: Devuelve el catálogo completo de espacios.
- `GET /zones/{id}`: Devuelve el espacio con el ID solicitado (o 404 si no existe).
- `POST /zones`: Crea un nuevo espacio validando name, capacity y status (devuelve 201).
- `PUT /zones/{id}`: Reemplaza todos los datos del espacio.
- `PATCH /zones/{id}`: Actualización parcial (cambio de estado o aforo).
- `DELETE /zones/{id}`: Elimina el espacio.

## Pruebas en local (Serverless Offline)

Rutas registradas en la terminal al iniciar `serverless-offline`:

```text
GET    | http://localhost:3000/dev/zones
GET    | http://localhost:3000/dev/zones/{id}
POST   | http://localhost:3000/dev/zones
PUT    | http://localhost:3000/dev/zones/{id}
PATCH  | http://localhost:3000/dev/zones/{id}
DELETE | http://localhost:3000/dev/zones/{id}
```

### Comprobaciones con curl

#### 1) GET /zones
```bash
curl.exe -i http://localhost:3000/dev/zones
```
Respuesta:
```http
HTTP/1.1 200 OK
content-type: application/json; charset=utf-8

[{"id":"ZONE-01","name":"Main Stage","capacity":5000,"status":"OPEN"},{"id":"ZONE-02","name":"Garden Stage","capacity":2500,"status":"FULL"},{"id":"ZONE-03","name":"Invernadero","capacity":1800,"status":"OPEN"},{"id":"ZONE-04","name":"Carpa Club","capacity":1200,"status":"CLOSED"}]
```

#### 2) GET /zones/ZONE-01 (Detalle)
```bash
curl.exe -i http://localhost:3000/dev/zones/ZONE-01
```
Respuesta:
```http
HTTP/1.1 200 OK
content-type: application/json; charset=utf-8

{"id":"ZONE-01","name":"Main Stage","capacity":5000,"status":"OPEN"}
```

#### 3) GET /zones/NO-EXISTE (Error 404)
```bash
curl.exe -i http://localhost:3000/dev/zones/NO-EXISTE
```
Respuesta:
```http
HTTP/1.1 404 Not Found
content-type: application/json; charset=utf-8

{"message":"Zona no encontrada"}
```

#### 4) POST /zones (Crear)
```bash
curl.exe -i -X POST http://localhost:3000/dev/zones -H "Content-Type: application/json" -d "{"name":"Zona VIP","capacity":300,"status":"OPEN"}"
```
Respuesta:
```http
HTTP/1.1 201 Created
content-type: application/json; charset=utf-8

{"id":"ZONE-05","name":"Zona VIP","capacity":300,"status":"OPEN"}
```

#### 5) PUT /zones/ZONE-01 (Actualizar completo)
```bash
curl.exe -i -X PUT http://localhost:3000/dev/zones/ZONE-01 -H "Content-Type: application/json" -d "{"name":"Main Stage Renovado","capacity":6000,"status":"OPEN"}"
```
Respuesta:
```http
HTTP/1.1 200 OK
content-type: application/json; charset=utf-8

{"id":"ZONE-01","name":"Main Stage Renovado","capacity":6000,"status":"OPEN","operation":"REPLACED"}
```

#### 6) PATCH /zones/ZONE-01 (Cambiar estado)
```bash
curl.exe -i -X PATCH http://localhost:3000/dev/zones/ZONE-01 -H "Content-Type: application/json" -d "{"status":"CLOSED"}"
```
Respuesta:
```http
HTTP/1.1 200 OK
content-type: application/json; charset=utf-8

{"id":"ZONE-01","name":"Main Stage Renovado","capacity":6000,"status":"CLOSED","changes":{"status":"CLOSED"},"operation":"UPDATED"}
```

#### 7) DELETE /zones/ZONE-04 (Eliminar)
```bash
curl.exe -i -X DELETE http://localhost:3000/dev/zones/ZONE-04
```
Respuesta:
```http
HTTP/1.1 200 OK
content-type: application/json; charset=utf-8

{"id":"ZONE-04","operation":"DELETED"}
```

## Despliegue en AWS

Despliegue ejecutado con Serverless Framework en AWS Academy (`us-west-2`):

```bash
cd backend
npm run build
npx serverless deploy --stage dev --region us-west-2
```

Salida del despliegue:
```text
Deploying "festival-control-api-karimb" to stage "dev" (us-west-2)
Service deployed to stack festival-control-api-karimb-dev (61s)

endpoints:
  GET - https://dlyp4k4she.execute-api.us-west-2.amazonaws.com/dev/zones
  GET - https://dlyp4k4she.execute-api.us-west-2.amazonaws.com/dev/zones/{id}
  POST - https://dlyp4k4she.execute-api.us-west-2.amazonaws.com/dev/zones
  PUT - https://dlyp4k4she.execute-api.us-west-2.amazonaws.com/dev/zones/{id}
  PATCH - https://dlyp4k4she.execute-api.us-west-2.amazonaws.com/dev/zones/{id}
  DELETE - https://dlyp4k4she.execute-api.us-west-2.amazonaws.com/dev/zones/{id}
```

Petición real contra AWS:
```bash
curl.exe -i "https://dlyp4k4she.execute-api.us-west-2.amazonaws.com/dev/zones"
```

Respuesta devuelta por API Gateway:
```http
HTTP/1.1 200 OK
Content-Type: application/json
Access-Control-Allow-Origin: *

[{"id":"ZONE-01","name":"Main Stage","capacity":5000,"status":"OPEN"},{"id":"ZONE-02","name":"Garden Stage","capacity":2500,"status":"FULL"},{"id":"ZONE-03","name":"Invernadero","capacity":1800,"status":"OPEN"},{"id":"ZONE-04","name":"Carpa Club","capacity":1200,"status":"CLOSED"}]
```

## Aplicación React Native Web

La aplicación cliente (`mobile/App.tsx`) incluye:
- **LISTADO:** Muestra las tarjetas con nombre, aforo y estado (dot verde/amarillo/rojo). Botón de recarga y botón de nuevo espacio.
- **DETALLE:** Muestra los datos del espacio seleccionado, botón para alternar estado (PATCH), botón para editar (PUT), botón para borrar (DELETE) y volver.
- **NUEVO:** Formulario para crear un espacio con validación.
- **EDITAR:** Formulario con los datos cargados para reemplazarlos (PUT).
- **Selector de entorno:** Botones en la cabecera para cambiar entre `Local (:3000)` y `AWS Cloud` en tiempo real.

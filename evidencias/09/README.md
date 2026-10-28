# Bloque 09

## Resultado

La aplicación cliente React Native Web se conectó al endpoint HTTPS publicado en AWS API Gateway (`https://dlyp4k4she.execute-api.us-west-2.amazonaws.com/dev`) con el backend local (Serverless Offline) completamente detenido. Se probaron los cinco métodos HTTP desde los botones de la interfaz, obteniendo las respuestas reales de las funciones Lambda y verificando su ejecución en CloudWatch.

### GET de la lista (Carga inicial)

```text
GET https://dlyp4k4she.execute-api.us-west-2.amazonaws.com/dev/events
HTTP 200
[{"id":"EVT-101","artist":"Neon Waves","space":"Main Stage","time":"22:30","status":"CONFIRMED"},{"id":"EVT-102","artist":"Midnight Session","space":"Club Stage","time":"23:45","status":"CONFIRMED"}]

CloudWatch (listEvents):
START - Version: $LATEST
INFO	LIST eventos: GET
END
REPORT Duration: 1.95 ms	Billed Duration: 2 ms	Memory Size: 1024 MB	Max Memory Used: 71 MB
```

### POST crear

```text
POST https://dlyp4k4she.execute-api.us-west-2.amazonaws.com/dev/events
Content-Type: application/json

{"artist":"Nova Pulse","space":"Main Stage","time":"21:00","status":"CONFIRMED"}

HTTP 201
{"id":"EVT-NEW","artist":"Nova Pulse","space":"Main Stage","time":"21:00","status":"CONFIRMED"}
```

### PUT reemplazar EVT-101

```text
PUT https://dlyp4k4she.execute-api.us-west-2.amazonaws.com/dev/events/EVT-101
Content-Type: application/json

{"artist":"Nova Pulse","space":"Main Stage","time":"21:00","status":"CONFIRMED"}

HTTP 200
{"id":"EVT-101","artist":"Nova Pulse","space":"Main Stage","time":"21:00","status":"CONFIRMED","operation":"REPLACED"}
```

### PATCH cancelar EVT-101

```text
PATCH https://dlyp4k4she.execute-api.us-west-2.amazonaws.com/dev/events/EVT-101
Content-Type: application/json

{"status":"CANCELLED"}

HTTP 200
{"id":"EVT-101","changes":{"status":"CANCELLED"},"operation":"UPDATED"}

CloudWatch (updateEvent):
START - e72a4feb-39c8-4a42-b007-f362f6c81d59 - Version: $LATEST
INFO	PATCH evento: EVT-101
END - e72a4feb-39c8-4a42-b007-f362f6c81d59
REPORT Duration: 8.83 ms	Billed Duration: 153 ms	Memory Size: 1024 MB	Max Memory Used: 71 MB
```

### DELETE EVT-102

```text
DELETE https://dlyp4k4she.execute-api.us-west-2.amazonaws.com/dev/events/EVT-102
HTTP 200
{"id":"EVT-102","operation":"DELETED"}
```

### Comparación de entornos

- **Entorno Local**: `API_URL = 'http://localhost:3000/dev'` con Serverless Offline activo en terminal local.
- **Entorno Cloud**: `API_URL = 'https://dlyp4k4she.execute-api.us-west-2.amazonaws.com/dev'` con Lambdas desplegadas en AWS Academy y Offline detenido.

La recarga posterior con `GET recargar` mantuvo las dos actuaciones iniciales (`EVT-101` y `EVT-102`) en estado `CONFIRMED`, confirmando que el cliente interactúa con los contratos HTTP en la nube sin simular persistencia en base de datos.

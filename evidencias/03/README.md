# Bloque 03

## Resultado

Añadí `POST /dev/events`. Con un body válido devuelve `201` y la ficha con id `EVT-NEW`. La función no guarda el envío; los datos de artista, espacio, hora y estado salen del body recibido.

## Salida de la prueba

Petición real enviada al backend local:

```text
POST http://localhost:3000/dev/events
Content-Type: application/json

{"artist":"EVIDENCIA-03-NOVA","space":"Main Stage","time":"21:00","status":"CONFIRMED"}
```

Respuesta de esa petición:

```text
HTTP 201
{"id":"EVT-NEW","artist":"EVIDENCIA-03-NOVA","space":"Main Stage","time":"21:00","status":"CONFIRMED"}
```

Log correspondiente de Serverless Offline:

```text
POST /dev/events (λ: createEvent)
POST evento: EVIDENCIA-03-NOVA
(λ: createEvent) RequestId: 0ff7f9c6-2383-4d21-9940-5476d376fe76
```

El nombre `EVIDENCIA-03-NOVA` aparece tanto en el body/respuesta como en el log del handler, relacionando la petición con su invocación.

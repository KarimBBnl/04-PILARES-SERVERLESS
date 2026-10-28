# Bloque 02

## Resultado

Añadí `GET /dev/events/{id}`. Las peticiones con `EVT-104`, `EVT-205` y `EVT-330` respondieron `200` y devolvieron el mismo id que iba en la URL. `GET /dev/hello` sigue respondiendo `200`.

## Comprensión

El id llega al handler en `event.pathParameters.id`. La ficha es una respuesta simulada: no se consulta ni se guarda nada en una base de datos. Si el evento no trae id, el handler responde `400` con `{"message":"Falta id"}`.

## Salida de la prueba

Esta pareja de salida se obtuvo al probar el bloque 02, cuando el handler devolvía la ficha simulada con el mismo id recibido en la ruta:

```text
Petición:
GET http://localhost:3000/dev/events/EVT-104

Respuesta:
HTTP/1.1 200 OK
{"id":"EVT-104","artist":"Neon Waves","space":"Main Stage","time":"22:30","status":"CONFIRMED"}

Log de esa invocación:
GET /dev/events/EVT-104 (λ: getEvent)
GET evento: EVT-104
(λ: getEvent) RequestId: 57b2379d-2520-4e07-a618-f2d6a80a48a3
```

La ruta y el valor registrados en `GET evento` corresponden al id de la petición. También se probaron `EVT-205` y `EVT-330`; ambos llegaron al handler con su id.

**Cambio del bloque 04:** al completar el CRUD, `GET /events/{id}` pasó a consultar un catálogo fijo con `EVT-101` y `EVT-102`. Por eso, repetir ahora la petición anterior con `EVT-104` da `404`; la respuesta `200` de arriba es la evidencia tomada antes de ese cambio.

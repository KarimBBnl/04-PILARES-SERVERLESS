# Bloque 04

## Resultado

La API local ofrece GET de la lista y de un id, POST, PUT, PATCH y DELETE. El catálogo inicial tiene EVT-101 y EVT-102. Un id desconocido responde 404.

### GET de la lista

```text
GET http://localhost:3000/dev/events
HTTP 200
[{"id":"EVT-101","artist":"Neon Waves","space":"Main Stage","time":"22:30","status":"CONFIRMED"},{"id":"EVT-102","artist":"Midnight Session","space":"Club Stage","time":"23:45","status":"CONFIRMED"}]

GET /dev/events (λ: listEvents)
LIST eventos: GET
(λ: listEvents) RequestId: 524f9ca5-88b7-415d-9d5b-eb8218fc405b
```

### GET por id inexistente

```text
GET http://localhost:3000/dev/events/EVT-999
HTTP 404
{"message":"Evento no encontrado"}

GET /dev/events/EVT-999 (λ: getEvent)
GET evento: EVT-999
(λ: getEvent) RequestId: 1652df26-a08e-4f81-88e7-6b48d7b12fa3
```

### POST

```text
POST http://localhost:3000/dev/events
Content-Type: application/json

{"artist":"EVIDENCIA-04-POST","space":"Main Stage","time":"20:15","status":"CONFIRMED"}

HTTP 201
{"id":"EVT-NEW","artist":"EVIDENCIA-04-POST","space":"Main Stage","time":"20:15","status":"CONFIRMED"}

POST /dev/events (λ: createEvent)
POST evento: EVIDENCIA-04-POST
(λ: createEvent) RequestId: 196806a2-c77d-4a7d-930b-d29c774c8296
```

### PUT completo

```text
PUT http://localhost:3000/dev/events/EVT-101
Content-Type: application/json

{"artist":"EVIDENCIA-04-PUT","space":"Main Stage","time":"20:30","status":"CANCELLED"}

HTTP 200
{"id":"EVT-101","artist":"EVIDENCIA-04-PUT","space":"Main Stage","time":"20:30","status":"CANCELLED","operation":"REPLACED"}

PUT /dev/events/EVT-101 (λ: replaceEvent)
PUT evento: EVT-101
(λ: replaceEvent) RequestId: fcd7d084-0a58-4057-8f18-6de3b1e0087f
```

### PATCH parcial

```text
PATCH http://localhost:3000/dev/events/EVT-102
Content-Type: application/json

{"status":"CANCELLED"}

HTTP 200
{"id":"EVT-102","changes":{"status":"CANCELLED"},"operation":"UPDATED"}

PATCH /dev/events/EVT-102 (λ: updateEvent)
PATCH evento: EVT-102
(λ: updateEvent) RequestId: 81f858ae-a03f-46a3-9652-2a6ebae69ba1
```

### DELETE

```text
DELETE http://localhost:3000/dev/events/EVT-102
HTTP 200
{"id":"EVT-102","operation":"DELETED"}

DELETE /dev/events/EVT-102 (λ: deleteEvent)
DELETE evento: EVT-102
(λ: deleteEvent) RequestId: f200a375-5f3e-41cd-8e34-b735a376b08c
```

La consulta posterior a EVT-101 devolvió el catálogo original, confirmando que PUT, PATCH y DELETE son simulaciones y no persisten cambios.

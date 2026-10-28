# Bloque 07

## Resultado

La interfaz cliente incorpora botones interactivos para ejecutar las operaciones de escritura del backend (`POST`, `PUT`, `PATCH` y `DELETE`). Cada acción bloquea los botones durante el envío (`busy`) y muestra debajo la respuesta real devuelta por el servidor.

### POST crear

```text
POST http://localhost:3000/dev/events
Content-Type: application/json

{"artist":"Nova Pulse","space":"Main Stage","time":"21:00","status":"CONFIRMED"}

HTTP 201
{"id":"EVT-NEW","artist":"Nova Pulse","space":"Main Stage","time":"21:00","status":"CONFIRMED"}

POST /dev/events (λ: createEvent)
POST evento: Nova Pulse
(λ: createEvent) RequestId: 6d61eef9-4638-4fb6-ae8a-b31a7a68f5cd
```

### PUT reemplazar EVT-101

```text
PUT http://localhost:3000/dev/events/EVT-101
Content-Type: application/json

{"artist":"Nova Pulse","space":"Main Stage","time":"21:00","status":"CONFIRMED"}

HTTP 200
{"id":"EVT-101","artist":"Nova Pulse","space":"Main Stage","time":"21:00","status":"CONFIRMED","operation":"REPLACED"}

PUT /dev/events/EVT-101 (λ: replaceEvent)
PUT evento: EVT-101
(λ: replaceEvent) RequestId: 5defcce4-6a51-47f7-838d-dcf9ae3e0899
```

### PATCH cancelar EVT-101

```text
PATCH http://localhost:3000/dev/events/EVT-101
Content-Type: application/json

{"status":"CANCELLED"}

HTTP 200
{"id":"EVT-101","changes":{"status":"CANCELLED"},"operation":"UPDATED"}

PATCH /dev/events/EVT-101 (λ: updateEvent)
PATCH evento: EVT-101
(λ: updateEvent) RequestId: c04037b7-4ba3-4840-a392-1d7044ade2a3
```

### DELETE EVT-102

```text
DELETE http://localhost:3000/dev/events/EVT-102
HTTP 200
{"id":"EVT-102","operation":"DELETED"}

DELETE /dev/events/EVT-102 (λ: deleteEvent)
DELETE evento: EVT-102
(λ: deleteEvent) RequestId: 1a24a0ec-e148-476e-b1f4-ee53a8feb372
```

### Cambio guiado (PATCH enviando CONFIRMED)

```text
PATCH http://localhost:3000/dev/events/EVT-101
Content-Type: application/json

{"status":"CONFIRMED"}

HTTP 200
{"id":"EVT-101","changes":{"status":"CONFIRMED"},"operation":"UPDATED"}

PATCH /dev/events/EVT-101 (λ: updateEvent)
PATCH evento: EVT-101
(λ: updateEvent) RequestId: 00f2cebb-06ff-4e1d-90ab-3bd7e503278e
```

La consulta posterior con `GET recargar` mantuvo las dos actuaciones iniciales en estado `CONFIRMED`, verificando que las mutaciones son simulaciones que no persisten en el catálogo del backend.

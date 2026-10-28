# Bloque 06

## Resultado

Se sustituyó el array local por llamadas HTTP a la API Serverless local (`http://localhost:3000/dev/events`). La pantalla carga los datos automáticamente al montar mediante `useEffect`, muestra el catálogo recibido y gestiona estados de carga y error de red mediante el botón `GET recargar`.

### Carga inicial por HTTP (200 OK)

```text
GET http://localhost:3000/dev/events
HTTP 200
[{"id":"EVT-101","artist":"Neon Waves","space":"Main Stage","time":"22:30","status":"CONFIRMED"},{"id":"EVT-102","artist":"Midnight Session","space":"Club Stage","time":"23:45","status":"CONFIRMED"}]

GET /dev/events (λ: listEvents)
LIST eventos: GET
(λ: listEvents) RequestId: 5751362f-9777-444a-98b4-eb8c41fdffa0
```

### Backend detenido (error de red)

Al detener el backend (`Ctrl+C`) y pulsar `GET recargar`:

```text
Petición:
GET http://localhost:3000/dev/events

Error en interfaz:
Failed to fetch
```

El helper detecta la caída de red y el componente atrapa la excepción mostrando el aviso sin bloquear la interfaz.

### Recuperación tras reiniciar el backend

Al arrancar de nuevo el backend y pulsar `GET recargar`:

```text
GET /dev/events (λ: listEvents)
LIST eventos: GET
(λ: listEvents) RequestId: a8edbbe2-5233-4e71-b61b-266fefc68f94
```

El mensaje de error desaparece y las tarjetas de `EVT-101` y `EVT-102` vuelven a mostrarse correctamente.

### Cambio guiado (ruta inexistente 404)

Al cambiar temporalmente la ruta de consulta a `/ruta-inexistente`:

```text
GET http://localhost:3000/dev/ruta-inexistente
HTTP 404

Resultado en interfaz:
HTTP 404: Not Found
```

Al restaurar la ruta `/events`, la consulta vuelve a responder `HTTP 200` con el catálogo completo.

# Bloque 01

## Resultado

La función `hello` responde a `GET /dev/hello` con estado HTTP 200 y un JSON que identifica el servicio.

## Salida de la prueba

Petición ejecutada con curl:

```text
curl.exe --include --header "X-Evidence-ID: B01-20261027-01" http://localhost:3000/dev/hello
```

Respuesta que devolvió esa petición:

```text
HTTP/1.1 200 OK
content-type: application/json; charset=utf-8

{"message":"Festival Control · equipo preparado","service":"hello"}
```

Registro correspondiente en la terminal de Serverless Offline. La misma marca `B01-20261027-01` aparece en las cabeceras del evento y permite relacionar el registro con la petición:

```text
GET /dev/hello (λ: hello)
EVENT RECIBIDO: {
  headers: {
    Host: 'localhost:3000',
    'User-Agent': 'curl/8.21.0',
    Accept: '*/*',
    'X-Evidence-ID': 'B01-20261027-01'
  },
  httpMethod: 'GET',
  path: '/hello',
  requestContext: {
    requestId: 'ab69a1b0-8458-4428-b5f8-6e55b4df67d0',
    resourcePath: '/dev/hello',
    stage: 'dev'
  }
}
(λ: hello) RequestId: 8d50ab9b-f4c4-4e90-913c-68280c5e51d6  Duration: 1205.88 ms  Billed Duration: 1206 ms
```

La respuesta HTTP y el evento del log se obtuvieron de la misma petición local. No se ha desplegado en AWS.

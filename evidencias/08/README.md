# Bloque 08

## Resultado

El servicio Serverless se desplegó en AWS Academy (región `us-west-2`) utilizando Serverless Framework y el rol de ejecución autorizado `LabRole` (`arn:aws:iam::931774569015:role/LabRole`). Se generó la pila de CloudFormation con API Gateway y las siete funciones Lambda publicadas con URLs HTTPS reales.

### Despliegue e información del servicio en AWS

```text
npx serverless deploy --stage dev --region us-west-2

Deploying "festival-control-api-karimb" to stage "dev" (us-west-2)
Service deployed to stack festival-control-api-karimb-dev (61s)

endpoints:
  GET - https://dlyp4k4she.execute-api.us-west-2.amazonaws.com/dev/hello
  GET - https://dlyp4k4she.execute-api.us-west-2.amazonaws.com/dev/events/{id}
  POST - https://dlyp4k4she.execute-api.us-west-2.amazonaws.com/dev/events
  GET - https://dlyp4k4she.execute-api.us-west-2.amazonaws.com/dev/events
  PUT - https://dlyp4k4she.execute-api.us-west-2.amazonaws.com/dev/events/{id}
  PATCH - https://dlyp4k4she.execute-api.us-west-2.amazonaws.com/dev/events/{id}
  DELETE - https://dlyp4k4she.execute-api.us-west-2.amazonaws.com/dev/events/{id}

functions:
  hello: festival-control-api-karimb-dev-hello
  getEvent: festival-control-api-karimb-dev-getEvent
  createEvent: festival-control-api-karimb-dev-createEvent
  listEvents: festival-control-api-karimb-dev-listEvents
  replaceEvent: festival-control-api-karimb-dev-replaceEvent
  updateEvent: festival-control-api-karimb-dev-updateEvent
  deleteEvent: festival-control-api-karimb-dev-deleteEvent
```

### Invocación cloud de GET /events

Petición real contra el endpoint de API Gateway:

```text
curl.exe -i "https://dlyp4k4she.execute-api.us-west-2.amazonaws.com/dev/events"

HTTP/1.1 200 OK
Content-Type: application/json
Access-Control-Allow-Origin: *

[{"id":"EVT-101","artist":"Neon Waves","space":"Main Stage","time":"22:30","status":"CONFIRMED"},{"id":"EVT-102","artist":"Midnight Session","space":"Club Stage","time":"23:45","status":"CONFIRMED"}]
```

Log en CloudWatch capturado con `serverless logs`:

```text
npx serverless logs -f listEvents --stage dev --region us-west-2

START - a4c2d625-53cb-4095-a56c-22272f90809a - Version: $LATEST
INFO	LIST eventos: GET
END - a4c2d625-53cb-4095-a56c-22272f90809a
REPORT Duration: 4.86 ms	Billed Duration: 125 ms	Memory Size: 1024 MB	Max Memory Used: 71 MB
```

### Consulta por id existente e inexistente

Consulta con id conocido (`EVT-101`):

```text
curl.exe -i "https://dlyp4k4she.execute-api.us-west-2.amazonaws.com/dev/events/EVT-101"

HTTP/1.1 200 OK
Content-Type: application/json
Access-Control-Allow-Origin: *

{"id":"EVT-101","artist":"Neon Waves","space":"Main Stage","time":"22:30","status":"CONFIRMED"}
```

Consulta con id inexistente (`NO-EXISTE`):

```text
curl.exe -i "https://dlyp4k4she.execute-api.us-west-2.amazonaws.com/dev/events/NO-EXISTE"

HTTP/1.1 404 Not Found
Content-Type: application/json
Access-Control-Allow-Origin: *

{"message":"Evento no encontrado"}
```

Log en CloudWatch de la Lambda `getEvent`:

```text
npx serverless logs -f getEvent --stage dev --region us-west-2

START - d5907fda-03c4-4c5e-9a5f-11e0ac01cd0d - Version: $LATEST
INFO	GET evento: EVT-101
END - d5907fda-03c4-4c5e-9a5f-11e0ac01cd0d
REPORT Duration: 6.37 ms	Billed Duration: 151 ms	Memory Size: 1024 MB	Max Memory Used: 71 MB

START - 8d271f79-fafd-41b0-8e77-9d3a41b67fb1 - Version: $LATEST
INFO	GET evento: NO-EXISTE
END - 8d271f79-fafd-41b0-8e77-9d3a41b67fb1
REPORT Duration: 1.88 ms	Billed Duration: 2 ms	Memory Size: 1024 MB	Max Memory Used: 71 MB
```

Se comprobó que el endpoint HTTPS responde con las mismas cabeceras CORS y códigos de estado que el entorno local, con ejecución real en funciones AWS Lambda.

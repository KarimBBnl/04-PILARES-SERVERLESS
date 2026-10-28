# Festival Control & Venue Control

Práctica de Serverless Framework y React Native (Expo) para la gestión de actuaciones y espacios de festival.

## Estructura

- `backend/`: API Serverless en Node.js 22 con TypeScript y soporte offline.
- `mobile/`: Cliente móvil en React Native (Expo Web) con TypeScript.
- `evidencias/`: Documentación de los bloques 01 a 09 y del reto evaluable (Venue Control).

## Ejecución del proyecto

### 1. Backend local
```bash
cd backend
npm install
npm run build
npm start
```
El servicio arranca en `http://localhost:3000/dev` mediante `serverless-offline`.

### 2. Frontend móvil
En otra terminal:
```bash
cd mobile
npm install
npm run web
```
La aplicación se abrirá en el navegador (`http://localhost:8081`). En la barra superior se puede alternar entre el servidor local y AWS Cloud.

### 3. Pruebas con curl
```bash
# Listar espacios
curl.exe -i http://localhost:3000/dev/zones

# Detalle de un espacio
curl.exe -i http://localhost:3000/dev/zones/ZONE-01

# Eliminar un espacio
curl.exe -i -X DELETE http://localhost:3000/dev/zones/ZONE-04
```

## Evidencias
- [Reto Evaluable: Venue Control](evidencias/evaluable/README.md)
- [Bloque 01: Primer Serverless](evidencias/01/README.md)
- [Bloque 02: GET + Parámetros](evidencias/02/README.md)
- [Bloque 03: POST + Body](evidencias/03/README.md)
- [Bloque 04: API CRUD](evidencias/04/README.md)
- [Bloque 05: React Native](evidencias/05/README.md)
- [Bloque 06: React Native + GET](evidencias/06/README.md)
- [Bloque 07: React Native CRUD](evidencias/07/README.md)
- [Bloque 08: Deploy AWS](evidencias/08/README.md)
- [Bloque 09: Cloud Launch](evidencias/09/README.md)

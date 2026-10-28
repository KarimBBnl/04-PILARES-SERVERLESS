import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult
} from 'aws-lambda';
import { findZone, isZoneInput, json, readBody, updateFullZone } from './model.js';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const id = event.pathParameters?.id;

  if (!id) {
    return json(400, { message: 'Falta id' });
  }

  const existing = findZone(id);
  if (!existing) {
    return json(404, { message: 'Zona no encontrada' });
  }

  const input = readBody(event.body);
  if (!isZoneInput(input)) {
    return json(400, {
      message: 'JSON con name, capacity y status (OPEN, FULL, CLOSED) requerido'
    });
  }

  console.log('PUT zone:', id);
  const updated = updateFullZone(id, input);
  return json(200, {
    ...updated,
    operation: 'REPLACED'
  });
};

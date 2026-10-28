import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult
} from 'aws-lambda';
import { findZone, json, removeZone } from './model.js';

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

  console.log('DELETE zone:', id);
  removeZone(id);
  return json(200, { id, operation: 'DELETED' });
};

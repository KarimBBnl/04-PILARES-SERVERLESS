import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult
} from 'aws-lambda';
import { findZone, json } from './model.js';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const id = event.pathParameters?.id;
  console.log('GET zone:', id);

  if (!id) {
    return json(400, { message: 'Falta id' });
  }

  const found = findZone(id);
  return found
    ? json(200, found)
    : json(404, { message: 'Zona no encontrada' });
};

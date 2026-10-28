import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult
} from 'aws-lambda';
import { addZone, isZoneInput, json, readBody } from './model.js';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const input = readBody(event.body);

  if (!isZoneInput(input)) {
    return json(400, {
      message: 'JSON con name, capacity y status (OPEN, FULL, CLOSED) requerido'
    });
  }

  console.log('POST zone:', input.name);
  const created = addZone(input);
  return json(201, created);
};

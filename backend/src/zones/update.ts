import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult
} from 'aws-lambda';
import { findZone, json, patchZone, readBody, type ZoneInput, type ZoneStatus } from './model.js';

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
  if (!input || Object.keys(input).length === 0) {
    return json(400, { message: 'Body vacio' });
  }

  const allowedStatuses: ZoneStatus[] = ['OPEN', 'FULL', 'CLOSED'];
  if (input.status !== undefined && !allowedStatuses.includes(input.status as ZoneStatus)) {
    return json(400, { message: 'Status invalido (OPEN, FULL, CLOSED)' });
  }

  const patchData: Partial<ZoneInput> = {};
  if (input.name !== undefined) patchData.name = String(input.name);
  if (input.capacity !== undefined) patchData.capacity = Number(input.capacity);
  if (input.status !== undefined) patchData.status = input.status as ZoneStatus;

  console.log('PATCH zone:', id, patchData);
  const updated = patchZone(id, patchData);

  return json(200, {
    ...updated,
    changes: patchData,
    operation: 'UPDATED'
  });
};

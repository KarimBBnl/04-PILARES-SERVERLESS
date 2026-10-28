import type { Zone, ZoneInput, ZoneStatus, FestivalEvent, EventInput, EventStatus } from './types';

export const LOCAL_API_URL = 'http://localhost:3000/dev';
export const CLOUD_API_URL = 'https://dlyp4k4she.execute-api.us-west-2.amazonaws.com/dev';

let activeApiUrl = LOCAL_API_URL;

export function getActiveApiUrl(): string {
  return activeApiUrl;
}

export function setActiveApiUrl(url: string): void {
  activeApiUrl = url;
}

async function request(path: string, method = 'GET', body?: unknown): Promise<unknown> {
  const options: RequestInit = {
    method,
    headers: {
      'Accept': 'application/json',
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {})
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {})
  };

  const response = await fetch(activeApiUrl + path, options);
  let value: unknown = null;
  try {
    value = await response.json();
  } catch {
    value = null;
  }

  if (!response.ok) {
    const message =
      typeof value === 'object' && value !== null && 'message' in value
        ? String((value as Record<string, unknown>).message)
        : response.statusText;
    throw new Error('HTTP ' + response.status + ': ' + message);
  }

  return value;
}

function isZone(value: unknown): value is Zone {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    typeof (value as Zone).id === 'string' &&
    'name' in value &&
    typeof (value as Zone).name === 'string' &&
    'capacity' in value &&
    typeof (value as Zone).capacity === 'number' &&
    'status' in value &&
    ['OPEN', 'FULL', 'CLOSED'].includes((value as Zone).status)
  );
}

// Venue Control (/zones)
export async function getZones(): Promise<Zone[]> {
  const value = await request('/zones');
  if (!Array.isArray(value) || !value.every(isZone)) {
    throw new Error('Respuesta de zonas no valida');
  }
  return value;
}

export async function getZone(id: string): Promise<Zone> {
  const value = await request('/zones/' + encodeURIComponent(id));
  if (!isZone(value)) {
    throw new Error('Zona no valida: ' + id);
  }
  return value;
}

export async function createZone(input: ZoneInput): Promise<Zone> {
  const value = await request('/zones', 'POST', input);
  if (!isZone(value)) {
    throw new Error('Respuesta de creacion no valida');
  }
  return value;
}

export async function replaceZone(id: string, input: ZoneInput): Promise<Zone> {
  const value = await request('/zones/' + encodeURIComponent(id), 'PUT', input);
  if (!isZone(value)) {
    throw new Error('Respuesta de actualizacion no valida');
  }
  return value;
}

export async function updateZoneStatus(id: string, status: ZoneStatus): Promise<Zone> {
  const value = await request('/zones/' + encodeURIComponent(id), 'PATCH', { status });
  return value as Zone;
}

export async function deleteZone(id: string): Promise<{ id: string; operation: string }> {
  const value = await request('/zones/' + encodeURIComponent(id), 'DELETE');
  return value as { id: string; operation: string };
}

// Bloques 05-07 anteriores
export async function getEvents(): Promise<FestivalEvent[]> {
  const value = await request('/events');
  return value as FestivalEvent[];
}

export const createEvent = (input: EventInput) => request('/events', 'POST', input);
export const replaceEvent = (id: string, input: EventInput) => request('/events/' + encodeURIComponent(id), 'PUT', input);
export const updateEvent = (id: string, status: EventStatus) => request('/events/' + encodeURIComponent(id), 'PATCH', { status });
export const deleteEvent = (id: string) => request('/events/' + encodeURIComponent(id), 'DELETE');

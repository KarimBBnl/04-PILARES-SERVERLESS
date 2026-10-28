import type { APIGatewayProxyResult } from 'aws-lambda';

export type ZoneStatus = 'OPEN' | 'FULL' | 'CLOSED';

export interface Zone {
  id: string;
  name: string;
  capacity: number;
  status: ZoneStatus;
}

export type ZoneInput = Omit<Zone, 'id'>;

export const initialZones: Zone[] = [
  { id: 'ZONE-01', name: 'Main Stage', capacity: 5000, status: 'OPEN' },
  { id: 'ZONE-02', name: 'Garden Stage', capacity: 2500, status: 'FULL' },
  { id: 'ZONE-03', name: 'Invernadero', capacity: 1800, status: 'OPEN' },
  { id: 'ZONE-04', name: 'Carpa Club', capacity: 1200, status: 'CLOSED' }
];

let zonesStore: Zone[] = [...initialZones];

export function getZones(): Zone[] {
  return zonesStore;
}

export function findZone(id: string): Zone | undefined {
  return zonesStore.find((item) => item.id.toUpperCase() === id.toUpperCase());
}

export function addZone(input: ZoneInput): Zone {
  const nextNumber = zonesStore.length + 1;
  const id = `ZONE-${String(nextNumber).padStart(2, '0')}`;
  const newZone: Zone = {
    id,
    name: input.name.trim(),
    capacity: Number(input.capacity),
    status: input.status
  };
  zonesStore.push(newZone);
  return newZone;
}

export function updateFullZone(id: string, input: ZoneInput): Zone | null {
  const index = zonesStore.findIndex((item) => item.id.toUpperCase() === id.toUpperCase());
  if (index === -1) return null;
  const updated: Zone = {
    id: zonesStore[index].id,
    name: input.name.trim(),
    capacity: Number(input.capacity),
    status: input.status
  };
  zonesStore[index] = updated;
  return updated;
}

export function patchZone(id: string, patch: Partial<ZoneInput>): Zone | null {
  const zone = findZone(id);
  if (!zone) return null;
  if (patch.name !== undefined) zone.name = patch.name.trim();
  if (patch.capacity !== undefined) zone.capacity = Number(patch.capacity);
  if (patch.status !== undefined) zone.status = patch.status;
  return zone;
}

export function removeZone(id: string): boolean {
  const index = zonesStore.findIndex((item) => item.id.toUpperCase() === id.toUpperCase());
  if (index === -1) return false;
  zonesStore.splice(index, 1);
  return true;
}

export const json = (
  statusCode: number,
  value: unknown
): APIGatewayProxyResult => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization'
  },
  body: JSON.stringify(value)
});

export function readBody(text: string | null): Record<string, unknown> | null {
  try {
    const value: unknown = JSON.parse(text ?? 'null');
    return typeof value === 'object' && value !== null && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

export function isZoneInput(
  value: Record<string, unknown> | null
): value is ZoneInput {
  if (value === null) return false;
  const nameValid = typeof value.name === 'string' && value.name.trim().length > 0;
  const capacityNum = typeof value.capacity === 'number' ? value.capacity : Number(value.capacity);
  const capacityValid = Number.isInteger(capacityNum) && capacityNum > 0;
  const statusValid = value.status === 'OPEN' || value.status === 'FULL' || value.status === 'CLOSED';
  return nameValid && capacityValid && statusValid;
}

export type PointStatus = 'available' | 'occupied' | 'damaged';
export type PortStatus = 'enabled' | 'occupied' | 'disabled';
export type ChargingPort = {id: string; label: string; zone: string; status: PortStatus};
export type CampusCoordinate = {latitude: number; longitude: number};
export type Aula = {
  id: string;
  building: string;
  floor: string;
  location: string;
  description?: string;
  status: PointStatus;
  updatedAt: string;
  ports: ChargingPort[];
  coordinates: CampusCoordinate;
};

export const buildingOptions = ['Edificio A', 'Edificio B', 'Edificio C', 'Edificio D'];
export const floorOptions = ['Piso 1', 'Piso 2', 'Piso 3'];

export function coordinateForBuilding(building: string): CampusCoordinate {
  const coordinates: Record<string, CampusCoordinate> = {
    A: {latitude: -0.21095, longitude: -78.48945},
    B: {latitude: -0.21056, longitude: -78.48893},
    C: {latitude: -0.21126, longitude: -78.48900},
    D: {latitude: -0.21063, longitude: -78.48963},
  };
  return coordinates[building.slice(-1).toUpperCase()] ?? coordinates.D;
}

export function createPorts(building: string, amount: number): ChargingPort[] {
  const prefix = building.slice(-1).toUpperCase();
  return Array.from({length: Math.max(1, amount)}, (_, index) => ({
    id: `${Date.now()}-${index}`,
    label: `${prefix}-${String(index + 1).padStart(2, '0')}`,
    zone: 'Zona principal',
    status: 'enabled',
  }));
}

export function statusFromPorts(ports: ChargingPort[]): PointStatus {
  if (ports.some(port => port.status === 'enabled')) return 'available';
  if (ports.some(port => port.status === 'occupied')) return 'occupied';
  return 'damaged';
}

export const initialAulas: Aula[] = [
  {id: '1', building: 'Edificio A', floor: 'Piso 1', location: 'Sala de estudio', description: 'Contactos en la pared junto a la ventana.', status: 'available', updatedAt: 'Hoy, 10:30', coordinates: coordinateForBuilding('Edificio A'), ports: [{id: 'a-1', label: 'A-01', zone: 'Ventana', status: 'enabled'}, {id: 'a-2', label: 'A-02', zone: 'Ventana', status: 'enabled'}, {id: 'a-3', label: 'A-03', zone: 'Mesas', status: 'occupied'}, {id: 'a-4', label: 'A-04', zone: 'Mesas', status: 'disabled'}]},
  {id: '2', building: 'Edificio B', floor: 'Piso 2', location: 'Biblioteca', description: 'Punto junto a las mesas de lectura.', status: 'occupied', updatedAt: 'Hoy, 10:20', coordinates: coordinateForBuilding('Edificio B'), ports: [{id: 'b-1', label: 'B-01', zone: 'Lectura', status: 'occupied'}, {id: 'b-2', label: 'B-02', zone: 'Lectura', status: 'occupied'}, {id: 'b-3', label: 'B-03', zone: 'Referencia', status: 'disabled'}]},
  {id: '3', building: 'Edificio C', floor: 'Piso 1', location: 'Pasillo norte', description: 'Requiere revisión técnica.', status: 'damaged', updatedAt: 'Ayer, 17:45', coordinates: coordinateForBuilding('Edificio C'), ports: [{id: 'c-1', label: 'C-01', zone: 'Acceso norte', status: 'disabled'}, {id: 'c-2', label: 'C-02', zone: 'Acceso norte', status: 'disabled'}]},
];

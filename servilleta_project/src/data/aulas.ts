export type Aula = {id: string; nombre: string; edificio: string; capacidad: string; fechaReserva: string; disponible: boolean; imagen: string};

export const defaultImage = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=300&q=80';
export const initialAulas: Aula[] = [
  {id: '1', nombre: 'Aula 101', edificio: 'Edificio de Aulas · Planta baja', capacidad: '35 estudiantes', fechaReserva: '2026-11-10', disponible: true, imagen: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=300&q=80'},
  {id: '2', nombre: 'Laboratorio A', edificio: 'Facultad de Sistemas · Piso 2', capacidad: '24 estudiantes', fechaReserva: '2026-11-12', disponible: false, imagen: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=300&q=80'},
  {id: '3', nombre: 'Auditorio 3', edificio: 'Administración · Planta baja', capacidad: '120 estudiantes', fechaReserva: '2026-11-15', disponible: true, imagen: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=300&q=80'},
];

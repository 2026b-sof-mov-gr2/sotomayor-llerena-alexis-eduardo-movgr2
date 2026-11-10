export type PointStatus = 'available' | 'occupied' | 'damaged';
export type Aula = {id:string; nombre:string; edificio:string; capacidad:string; fechaReserva:string; disponible:boolean; imagen:string; status?:PointStatus; description?:string};
export const defaultImage = '';
export const initialAulas: Aula[] = [
  {id:'1',nombre:'Edificio A',edificio:'Sala de estudio · Piso 1',capacidad:'Piso 1',fechaReserva:'Hoy, 10:30',disponible:true,imagen:'',status:'available',description:'Contactos en la pared junto a la ventana.'},
  {id:'2',nombre:'Edificio B',edificio:'Biblioteca · Piso 2',capacidad:'Piso 2',fechaReserva:'Hoy, 10:20',disponible:false,imagen:'',status:'occupied',description:'Punto junto a las mesas de lectura.'},
  {id:'3',nombre:'Edificio C',edificio:'Pasillo norte · Piso 1',capacidad:'Piso 1',fechaReserva:'Ayer, 17:45',disponible:false,imagen:'',status:'damaged',description:'Requiere revisión técnica.'},
];

export interface IAlert {
  tipo: 'success' | 'danger' | 'warning' | 'info';
  mensaje: string;
}
export interface IRegistrarClub {
  nombre: string;
  deporteId: number;
  ciudadId: number;
  direccion?: string | null;
  telefono?: string | null;
  email?: string | null;
  descripcion?: string | null;
  ramas: IRama[];
  adminEmail: string;
  adminUsername: string;
  adminPassword: string;
  adminNombre: string;
  adminApellido?: string | null;
  adminDocumento?: string | null;
  adminTelefono?: string | null;
  categorias: ICategoria[];
}

export interface IRama {
  tipoRamaId: number;
  nombre?: string;
  descripcion?: string;
}

export interface ICategoria {
  nombre: string;
  ramaNombre: string;
  descripcion: '';
  tipoRamaId: number;
}
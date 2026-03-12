export interface ClubInfo {
  nombre: string;
  deporte: string;
  ciudad: string;
  telefono: string;
  email: string;
  direccion?: string;
  descripcion?: string;
}

export interface Ramas {
  masculina: boolean;
  femenina: boolean;
  nombreMasculina?: string;
  nombreFemenina?: string;
}

export interface Categorias {
  masculina: string[];
  femenina: string[];
}

export interface AdminInfo {
  nombre: string;
  documento: string;
  telefono: string;
  email: string;
  password: string;
  aceptaTerminos: boolean;
  aceptaComunicaciones: boolean;
}

export interface RegistroData {
  club: ClubInfo;
  ramas: Ramas;
  categorias: Categorias;
  admin: AdminInfo;
}
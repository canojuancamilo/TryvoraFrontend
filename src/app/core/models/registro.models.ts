export interface ClubInfo {
  nombre: string;
  deporteId: number | null;
  ciudadId: number | null;
  telefono: string;
  email: string;
  direccion?: string;
  descripcion?: string;
  departamentoId: number | null;
}

export interface RamasInfo {
  masculina: boolean;
  femenina: boolean;
  nombreMasculina?: string;
  nombreFemenina?: string;
}

export interface CategoriasInfo {
  masculina: string[];
  femenina: string[];
}

export interface AdminInfo {
  nombre: string;
  documento: string;
  telefono: string;
  email: string;
  password: string;
  confirmPassword:string;
  aceptaTerminos: boolean;
  aceptaComunicaciones: boolean;
}

export interface RegistroData {
  club: ClubInfo;
  ramas: RamasInfo;
  categorias: CategoriasInfo;
  admin: AdminInfo;
}

export type StepNumber = 1 | 2 | 3 | 4 | 5;
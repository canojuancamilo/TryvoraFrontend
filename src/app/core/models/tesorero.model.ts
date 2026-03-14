export interface Tesorero {
  id?: string;
  nombre: string;
  email: string;
  telefono: string;
  estado: boolean;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
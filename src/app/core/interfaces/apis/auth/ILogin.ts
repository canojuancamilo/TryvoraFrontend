export interface ILogin {
  email: string;
  password: string;
  recordarSesion: boolean;
}

export interface ILoginResponse {
  usuarioId: number;
  email: string;
  username: string;
  nombre: string;
  apellido?: string | null;
  avatar?: string | null;
  token: string;
  refreshToken: string;
  expiration: Date | string; // Puede ser Date o string dependiendo de cómo lo serialices
  roles: IRol[];
  permisos: IPermiso[];
  clubs: IClubBasico[];
  emailConfirmed: boolean;
  clubActivo?: IClubBasico | null; // Club seleccionado actualmente
}

export interface IRol {
  id: number;
  nombre: string;
  descripcion?: string | null;
}

export interface IPermiso {
  id: number;
  nombre: string;
  descripcion?: string | null;
}

export interface IClubBasico {
  id: number;
  nombre: string;
  deporte: number;
  deporteNombre?: string | null;
}

export interface LoginResultDto {
  data: ILoginResponse;
  requiresTwoFactor: boolean;
  isLockedOut: boolean;
  remainingAttempts?: number | null;
}
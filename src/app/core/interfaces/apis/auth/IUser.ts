import { IClubBasico, IPermiso, IRol } from "./ILogin";

export interface IUser {
  id: number;
  username: string;
  email: string;
  nombre: string;
  apellido: string | null;
  roles: IRol[];
  permissions: IPermiso[];
  avatar?: string | null;
  token?: string;
  refreshToken?: string;
  expiresIn?: string | Date;
  clubInfo?: IClubBasico;
}

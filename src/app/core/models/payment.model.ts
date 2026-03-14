export interface Payment {
  id: number;
  player: string;
  category: string;
  branch: 'masculino' | 'femenino';
  amount: number;
  date: Date;
  initials: string;
  status?: 'pending' | 'approved' | 'rejected';
}

export interface PaymentStats {
  pending: number;
  approved: number;
  rejected: number;
  totalMonth: number;
}
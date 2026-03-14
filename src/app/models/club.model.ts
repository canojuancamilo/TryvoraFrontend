export interface Club {
  id: number;
  name: string;
  city: string;
  sport: string;
  players: number;
  income: number;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  date: string;
  admin: string;
  email: string;
  branches: string[];
  color: string;
}

export interface ClubFilters {
  search: string;
  sport: string;
  status: string;
  period: string;
}

export type SortField = 'name' | 'sport' | 'players' | 'income' | 'status' | 'date';
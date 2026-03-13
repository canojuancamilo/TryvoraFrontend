export interface ClubInfo {
  name: string;
  avatar: string;
  role: string;
}

export interface UserInfo {
  name: string;
  email: string;
  avatar: string;
  role: string;
}

export interface StatCard {
  id: string;
  type: 'indigo' | 'green' | 'red' | 'cyan';
  icon: string;
  value: number | string;
  label: string;
  change: {
    direction: 'up' | 'down' | 'neutral';
    value: string;
  };
}

export interface BranchStats {
  type: 'masculino' | 'femenino' | 'total';
  totalPlayers: number;
  upToDate: number;
  debtors: number;
  debtAmount: number;
  monthlyIncome: number;
}

export interface ActivityItem {
  id: string;
  type: 'payment' | 'player' | 'alert';
  title: string;
  description: string;
  time: Date;
}

export interface PendingApproval {
  id: string;
  name: string;
  category: string;
  amount: number;
  time: Date;
  branch: string;
  ageGroup?: string;
}

export interface DashboardSummary {
  totalPlayers: number;
  upToDate: number;
  debtors: number;
  monthlyIncome: number;
  branches: {
    masculino: BranchStats;
    femenino: BranchStats;
    total: BranchStats;
  };
  recentActivity: ActivityItem[];
  pendingApprovals: PendingApproval[];
}
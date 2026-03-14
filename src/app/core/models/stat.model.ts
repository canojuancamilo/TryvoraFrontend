export interface Stat {
  id: string;
  value: number | string;
  label: string;
  icon: string;
  color: 'amber' | 'green' | 'red' | 'indigo';
  change?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
  };
}
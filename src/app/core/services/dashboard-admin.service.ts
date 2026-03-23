// src/app/core/services/dashboard.service.ts
import { Injectable, signal, computed, inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { Observable, interval } from 'rxjs';
import { switchMap, map, shareReplay } from 'rxjs/operators';
import { ActivityItem, DashboardSummary, PendingApproval, StatCard } from '../models/dashboard-admin.model';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardAdminService {
  private http = inject(HttpClient);
  private notificationService = inject(NotificationService);
  
  private refreshInterval = 30000; // 30 segundos
  private refreshSubscription: any;
  
  // Señales para el estado
  private dashboardData = signal<DashboardSummary | null>(null);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);
  private lastUpdateSignal = signal<Date | null>(null);
  
  // Getters públicos (readonly)
  public readonly loading = this.loadingSignal.asReadonly();
  public readonly error = this.errorSignal.asReadonly();
  public readonly lastUpdate = this.lastUpdateSignal.asReadonly();
  
  // Señales computadas
  public readonly totalPlayers = computed(() => this.dashboardData()?.totalPlayers ?? 0);
  public readonly upToDateCount = computed(() => this.dashboardData()?.upToDate ?? 0);
  public readonly debtorsCount = computed(() => this.dashboardData()?.debtors ?? 0);
  public readonly monthlyIncome = computed(() => this.dashboardData()?.monthlyIncome ?? 0);
  
  public readonly upToDatePercentage = computed(() => {
    const total = this.totalPlayers();
    return total > 0 ? Math.round((this.upToDateCount() / total) * 100) : 0;
  });
  
  public readonly debtorsPercentage = computed(() => {
    const total = this.totalPlayers();
    return total > 0 ? Math.round((this.debtorsCount() / total) * 100) : 0;
  });
  

  public readonly statCards = computed<StatCard[]>(() => {
    const data = this.dashboardData();
    if (!data) return [];
    
    return [
      {
        id: 'total-players',
        type: 'indigo',
        icon: 'bi-people-fill',
        value: data.totalPlayers,
        label: 'Total Jugadores',
        change: { direction: 'up', value: '+6 este mes' }
      },
      {
        id: 'up-to-date',
        type: 'green',
        icon: 'bi-check-circle-fill',
        value: data.upToDate,
        label: 'Al Día',
        change: { direction: 'up', value: `${this.upToDatePercentage()}% del total` }
      },
      {
        id: 'debtors',
        type: 'red',
        icon: 'bi-exclamation-circle-fill',
        value: data.debtors,
        label: 'Deudores',
        change: { direction: 'down', value: '-3 vs mes anterior' }
      },
      {
        id: 'income',
        type: 'cyan',
        icon: 'bi-cash-stack',
        value: `$${data.monthlyIncome.toLocaleString()}`,
        label: 'Ingresos del Mes',
        change: { direction: 'up', value: '+12% vs anterior' }
      }
    ];
  });
  
  // Señales computadas para branches
  public readonly branchStats = computed(() => this.dashboardData()?.branches ?? null);
  
  public readonly recentActivity = computed(() => this.dashboardData()?.recentActivity ?? []);
  public readonly pendingApprovals = computed(() => this.dashboardData()?.pendingApprovals ?? []);
  public readonly pendingCount = computed(() => this.pendingApprovals().length);
  
  constructor() {
    this.loadInitialData();
  }
  
  private loadInitialData(): void {
    // Cargar datos de ejemplo (simulados)
    this.loadMockData();
  }
  
  private loadMockData(): void {
    const mockData: DashboardSummary = {
      totalPlayers: 124,
      upToDate: 98,
      debtors: 26,
      monthlyIncome: 4820,
      branches: {
        masculino: {
          type: 'masculino',
          totalPlayers: 72,
          upToDate: 58,
          debtors: 14,
          debtAmount: 1260,
          monthlyIncome: 2900
        },
        femenino: {
          type: 'femenino',
          totalPlayers: 52,
          upToDate: 40,
          debtors: 12,
          debtAmount: 980,
          monthlyIncome: 1920
        },
        total: {
          type: 'total',
          totalPlayers: 124,
          upToDate: 98,
          debtors: 26,
          debtAmount: 2240,
          monthlyIncome: 4820
        }
      },
      recentActivity: this.generateMockActivities(),
      pendingApprovals: this.generateMockApprovals()
    };
    
    this.dashboardData.set(mockData);
    this.lastUpdateSignal.set(new Date());
  }
  
  private generateMockActivities(): ActivityItem[] {
    return [
      {
        id: '1',
        type: 'payment',
        title: 'Pago aprobado — Martín López',
        description: 'Mensualidad Marzo · Masculino · $50',
        time: new Date(Date.now() - 12 * 60000)
      },
      {
        id: '2',
        type: 'player',
        title: 'Nuevo jugador — Sofía Ramírez',
        description: 'Sub-18 · Femenino · Activa',
        time: new Date(Date.now() - 60 * 60000)
      },
      {
        id: '3',
        type: 'payment',
        title: 'Pago aprobado — Diego Herrera',
        description: 'Mensualidad Marzo · Masculino · $50',
        time: new Date(Date.now() - 120 * 60000)
      },
      {
        id: '4',
        type: 'alert',
        title: 'Recordatorio enviado — 5 deudores',
        description: 'Notificación de pago pendiente',
        time: new Date(Date.now() - 180 * 60000)
      },
      {
        id: '5',
        type: 'player',
        title: 'Nuevo jugador — Andrés Vega',
        description: 'Primera División · Masculino · Activo',
        time: new Date(Date.now() - 24 * 3600000)
      }
    ];
  }
  
  private generateMockApprovals(): PendingApproval[] {
    return [
      {
        id: 'a1',
        name: 'Valentina Torres',
        category: 'Mensualidad Marzo',
        amount: 50,
        time: new Date(Date.now() - 30 * 60000),
        branch: 'Femenino',
        ageGroup: 'Sub-15'
      },
      {
        id: 'a2',
        name: 'Rodrigo Méndez',
        category: 'Mensualidad Marzo',
        amount: 50,
        time: new Date(Date.now() - 60 * 60000),
        branch: 'Masculino',
        ageGroup: 'Primera'
      },
      {
        id: 'a3',
        name: 'Camila Jiménez',
        category: 'Mensualidad Marzo',
        amount: 50,
        time: new Date(Date.now() - 120 * 60000),
        branch: 'Femenino',
        ageGroup: 'Sub-18'
      }
    ];
  }

  public refreshDashboard(): void {
    this.loadingSignal.set(true);
    
    // Simular llamada API

      this.loadMockData();
      this.loadingSignal.set(false);
      this.notificationService.info('Dashboard actualizado');
  }
  
  public approvePayment(approvalId: string): void {
    const current = this.dashboardData();
    if (current) {
      const updatedApprovals = current.pendingApprovals.filter(a => a.id !== approvalId);
      this.dashboardData.set({
        ...current,
        pendingApprovals: updatedApprovals
      });
      this.notificationService.success('Pago aprobado correctamente');
    }
  }
  
  public rejectPayment(approvalId: string): void {
    const current = this.dashboardData();
    if (current) {
      const updatedApprovals = current.pendingApprovals.filter(a => a.id !== approvalId);
      this.dashboardData.set({
        ...current,
        pendingApprovals: updatedApprovals
      });
      this.notificationService.error('Pago rechazado');
    }
  }
  
  public getDashboardData() {
    return this.dashboardData.asReadonly();
  }
  
  // Limpiar suscripciones
  public destroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }
}
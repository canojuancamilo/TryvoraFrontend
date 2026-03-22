import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Sidebar } from '../../../shared/componentes/sidebar/sidebar';
import { Topbar } from '../../../shared/componentes/topbar/topbar';
import { WelcomeBanner } from '../../../shared/componentes/welcome-banner/welcome-banner';
import { StatsGrid } from '../../../shared/componentes/stats-grid/stats-grid';
import { BranchSummary } from '../../../shared/componentes/BranchSummary/BranchSummary';
import { RecentActivity } from '../../../shared/componentes/RecentActivity/RecentActivity';
import { QuickActions } from '../../../shared/componentes/QuickActions/QuickActions';
import { PendingApprovals } from '../../../shared/componentes/PendingApprovals/PendingApprovals';
import { Subject } from 'rxjs';
import { UiService } from '../../../core/services/ui.service';
import { DashboardAdminService } from '../../../core/services/dashboard-admin.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';
import { IUser } from '../../../core/interfaces/apis/auth/IUser';

@Component({
  selector: 'app-admin-club-dashboard',
  imports: [
    Sidebar,
    Topbar,
    WelcomeBanner,
    StatsGrid,
    BranchSummary,
    RecentActivity,
    QuickActions,
    PendingApprovals],
  templateUrl: './admin-club-dashboard.html',
  styleUrl: './admin-club-dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminClubDashboard {
  uiService = inject(UiService);
  private dashboardService = inject(DashboardAdminService);
  private notificationService = inject(NotificationService);
  private authService = inject(AuthService);

  public readonly sidebarOpen = this.uiService.sidebarOpen;
  public readonly isMobile = this.uiService.isMobile;
  public readonly sidebarClass = this.uiService.sidebarClass;
  public readonly mainWrapperClass = this.uiService.mainWrapperClass;

  public readonly statCards = this.dashboardService.statCards;
  public readonly branchStats = this.dashboardService.branchStats;
  public readonly recentActivity = this.dashboardService.recentActivity;
  public readonly pendingApprovals = this.dashboardService.pendingApprovals;
  public readonly pendingCount = this.dashboardService.pendingCount;
  public readonly lastUpdate = this.dashboardService.lastUpdate;

  usuarioLogueado = signal<IUser>({
    id: 0,
    nombre:'',
    apellido: '',
    username: '',
    email: '',
    roles: [],
    permissions: [],
  })

  constructor(){
    this.usuarioLogueado.set(this.authService.currentUser!)
  }

  ngOnInit(): void {
    // Cargar datos iniciales
    // this.dashboardService.refreshDashboard();

    // Configurar debounce para búsqueda
    // this.searchSubscription = this.searchSubject.pipe(
    //   debounceTime(300), // Esperar 300ms después de que el usuario deje de escribir
    //   distinctUntilChanged(), // Solo buscar si el valor cambió
    //   filter(query => query.length === 0 || query.length > 2) // Buscar si está vacío o tiene más de 2 caracteres
    // ).subscribe(query => {
    //   this.performSearch(query);
    // });
  }

  ngOnDestroy(): void {
    // Limpiar suscripciones
    this.dashboardService.destroy();
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  // Métodos para manejar el sidebar
  toggleSidebar(): void {
    this.uiService.toggleSidebar();
  }

  openSidebar(): void {
    this.uiService.openSidebar();
  }

  closeSidebar(): void {
    this.uiService.closeSidebar();
  }

  // Métodos para acciones del dashboard
  onApprove(approvalId: string): void {
    this.dashboardService.approvePayment(approvalId);
  }

  onReject(approvalId: string): void {
    this.dashboardService.rejectPayment(approvalId);
  }

  onAddPlayer(): void {
    this.notificationService.info('Navegando a agregar jugador...');
    // Aquí iría la navegación
  }

  onRegisterPayment(): void {
    this.notificationService.info('Abriendo registro de pago...');
  }

  onSendNotification(): void {
    this.notificationService.info('Abriendo centro de notificaciones...');
  }

  refreshDashboard(): void {
    this.dashboardService.refreshDashboard();
  }

  // Toggle dark mode (opcional)
  toggleDarkMode(): void {
    this.uiService.toggleDarkMode();
  }

  // Versión más avanzada con debounce para no buscar en cada tecla
  private searchSubject = new Subject<string>();
  private searchSubscription: any;

  // Método público que llama al subject (para usar en el template)
  onSearch(query: string): void {
    this.searchSubject.next(query);
  }

  // Método privado que realiza la búsqueda real
  private performSearch(query: string): void {
    if (query && query.length > 2) {
      console.log('Realizando búsqueda:', query);
      this.notificationService.info(`Buscando: "${query}"`);

      // Aquí iría la lógica real de búsqueda
      // this.dashboardService.search(query).subscribe(...);
    } else if (query.length === 0) {
      console.log('Limpiando búsqueda');
      // Limpiar resultados de búsqueda
    }
  }
}

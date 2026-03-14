import { Injectable, signal, computed } from '@angular/core';
import { Club, ClubFilters, SortField } from '../models/club.model';

@Injectable({
  providedIn: 'root'
})
export class ClubService {
  // Señales privadas
  private clubsSignal = signal<Club[]>([]);
  private filtersSignal = signal<ClubFilters>({
    search: '',
    sport: '',
    status: '',
    period: ''
  });
  private sortFieldSignal = signal<SortField>('name');
  private sortDirSignal = signal<number>(1);
  private currentPageSignal = signal<number>(1);
  private readonly rowsPerPage = 8;

  // Señales públicas de solo lectura
  readonly clubs = this.clubsSignal.asReadonly();
  readonly filters = this.filtersSignal.asReadonly();
  readonly sortField = this.sortFieldSignal.asReadonly();
  readonly sortDir = this.sortDirSignal.asReadonly();
  readonly currentPage = this.currentPageSignal.asReadonly();

  // Datos computados
  readonly filteredClubs = computed(() => {
    const clubs = this.clubsSignal();
    const filters = this.filtersSignal();
    
    return clubs.filter(club => {
      const search = filters.search.toLowerCase();
      const matchSearch = !search || 
        club.name.toLowerCase().includes(search) || 
        club.city.toLowerCase().includes(search);
      const matchSport = !filters.sport || club.sport === filters.sport;
      const matchStatus = !filters.status || club.status === filters.status;
      const matchPeriod = !filters.period || club.date.startsWith(filters.period);
      
      return matchSearch && matchSport && matchStatus && matchPeriod;
    });
  });

  readonly sortedClubs = computed(() => {
    const clubs = [...this.filteredClubs()];
    const field = this.sortFieldSignal();
    const dir = this.sortDirSignal();
    
    if (field) {
      clubs.sort((a, b) => {
        let va = a[field];
        let vb = b[field];
        if (typeof va === 'string') va = va.toLowerCase();
        if (typeof vb === 'string') vb = vb.toLowerCase();
        return va < vb ? -dir : va > vb ? dir : 0;
      });
    }
    return clubs;
  });

  readonly paginatedClubs = computed(() => {
    const start = (this.currentPageSignal() - 1) * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    return this.sortedClubs().slice(start, end);
  });

  readonly totalPages = computed(() => 
    Math.ceil(this.filteredClubs().length / this.rowsPerPage)
  );

  readonly paginationInfo = computed(() => {
    const start = (this.currentPageSignal() - 1) * this.rowsPerPage + 1;
    const end = Math.min(this.currentPageSignal() * this.rowsPerPage, this.filteredClubs().length);
    const total = this.filteredClubs().length;
    return { start, end, total };
  });

  readonly stats = computed(() => {
    const clubs = this.clubsSignal();
    const activePlayers = clubs.reduce((sum, c) => sum + c.players, 0);
    const totalIncome = clubs.reduce((sum, c) => sum + c.income, 0);
    const debtors = 43; // Esto podría calcularse de otra fuente
    
    return {
      totalClubs: clubs.length,
      activePlayers,
      totalIncome: `€${(totalIncome / 1000).toFixed(1)}K`,
      debtors
    };
  });

  constructor() {
    // Cargar datos iniciales
    this.loadInitialData();
  }

  private loadInitialData() {
    const initialData: Club[] = [
      { id: 1, name: 'Club Atlético Norte', city: 'Madrid', sport: 'Fútbol', players: 48, income: 2400, status: 'active', date: '2024-03-15', admin: 'Carlos García', email: 'atletico@norte.es', branches: ['Masculino', 'Femenino'], color: '#4F46E5' },
      { id: 2, name: 'Baloncesto Sur', city: 'Sevilla', sport: 'Baloncesto', players: 32, income: 1600, status: 'active', date: '2024-05-22', admin: 'María López', email: 'info@bsur.es', branches: ['Masculino'], color: '#06B6D4' },
      // ... resto de los datos
    ];
    this.clubsSignal.set(initialData);
  }

  updateFilters(filters: Partial<ClubFilters>) {
    this.filtersSignal.update(current => ({ ...current, ...filters }));
    this.currentPageSignal.set(1); // Resetear página al filtrar
  }

  sort(field: SortField) {
    this.sortFieldSignal.update(current => {
      if (current === field) {
        this.sortDirSignal.update(d => d * -1);
        return current;
      }
      this.sortDirSignal.set(1);
      return field;
    });
  }

  changePage(direction: number) {
    this.currentPageSignal.update(current => 
      Math.max(1, Math.min(current + direction, this.totalPages()))
    );
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPageSignal.set(page);
    }
  }

  addClub(club: Omit<Club, 'id'>) {
    const newId = Math.max(...this.clubsSignal().map(c => c.id)) + 1;
    this.clubsSignal.update(clubs => [...clubs, { ...club, id: newId }]);
  }

  updateClub(id: number, updates: Partial<Club>) {
    this.clubsSignal.update(clubs =>
      clubs.map(c => c.id === id ? { ...c, ...updates } : c)
    );
  }

  deleteClub(id: number) {
    this.clubsSignal.update(clubs => clubs.filter(c => c.id !== id));
  }

  toggleStatus(id: number) {
    this.clubsSignal.update(clubs =>
      clubs.map(c => {
        if (c.id === id) {
          const newStatus = c.status === 'active' ? 'inactive' : 'active';
          return { ...c, status: newStatus };
        }
        return c;
      })
    );
  }

  getClubById(id: number): Club | undefined {
    return this.clubsSignal().find(c => c.id === id);
  }
}
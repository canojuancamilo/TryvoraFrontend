import { Injectable, signal, computed, inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Tesorero } from '../models/tesorero.model';

@Injectable({
  providedIn: 'root'
})
export class TesoreroService {
  // Estado privado
  private tesorerosSignal = signal<Tesorero[]>([
    { 
      id: '1',
      nombre: 'Laura Martínez', 
      email: 'laura.martinez@fcnorte.com', 
      telefono: '+54 9 11 4523-7890', 
      estado: true,
      createdAt: new Date()
    },
    { 
      id: '2',
      nombre: 'Roberto Sánchez', 
      email: 'roberto.sanchez@fcnorte.com', 
      telefono: '+54 9 11 6712-3456', 
      estado: true,
      createdAt: new Date()
    },
    { 
      id: '3',
      nombre: 'Ana Gómez', 
      email: 'ana.gomez@fcnorte.com', 
      telefono: '+54 9 11 8934-5678', 
      estado: false,
      createdAt: new Date()
    },
  ]);

  private searchTermSignal = signal<string>('');

  // Señales públicas de solo lectura
  readonly tesoreros = this.tesorerosSignal.asReadonly();
  readonly searchTerm = this.searchTermSignal.asReadonly();

  // Señales computadas
  readonly filteredTesoreros = computed(() => {
    const term = this.searchTermSignal().toLowerCase();
    const items = this.tesorerosSignal();
    
    if (!term) return items;
    
    return items.filter(t => 
      t.nombre.toLowerCase().includes(term) ||
      t.email.toLowerCase().includes(term) ||
      t.telefono.includes(term)
    );
  });

  readonly totalCount = computed(() => this.tesorerosSignal().length);
  readonly activeCount = computed(() => 
    this.tesorerosSignal().filter(t => t.estado).length
  );
  readonly inactiveCount = computed(() => 
    this.tesorerosSignal().filter(t => !t.estado).length
  );

  // Métodos para modificar el estado
  addTesorero(tesorero: Omit<Tesorero, 'id' | 'createdAt'>): void {
    const newTesorero: Tesorero = {
      ...tesorero,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.tesorerosSignal.update(current => [...current, newTesorero]);
  }

  updateTesorero(id: string, tesorero: Partial<Tesorero>): void {
    this.tesorerosSignal.update(current =>
      current.map(t => 
        t.id === id 
          ? { ...t, ...tesorero, updatedAt: new Date() }
          : t
      )
    );
  }

  deleteTesorero(id: string): void {
    this.tesorerosSignal.update(current => 
      current.filter(t => t.id !== id)
    );
  }

  toggleEstado(id: string): void {
    this.tesorerosSignal.update(current =>
      current.map(t =>
        t.id === id
          ? { ...t, estado: !t.estado, updatedAt: new Date() }
          : t
      )
    );
  }

  setSearchTerm(term: string): void {
    this.searchTermSignal.set(term);
  }

  getTesoreroById(id: string): Tesorero | undefined {
    return this.tesorerosSignal().find(t => t.id === id);
  }
}
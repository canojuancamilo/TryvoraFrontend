import { Injectable, signal, computed } from '@angular/core';

export interface BranchIncome {
  total: number;
  count: number;
}

export interface IncomeData {
  masculine: BranchIncome;
  feminine: BranchIncome;
}

@Injectable({
  providedIn: 'root'
})
export class IncomeService {
  private incomeData = signal<IncomeData>({
    masculine: { total: 2730, count: 63 },
    feminine: { total: 2090, count: 49 }
  });

  readonly masculine = computed(() => this.incomeData().masculine);
  readonly feminine = computed(() => this.incomeData().feminine);
  
  readonly grandTotal = computed(() => 
    this.incomeData().masculine.total + this.incomeData().feminine.total
  );
  
  readonly totalPlayers = computed(() => 
    this.incomeData().masculine.count + this.incomeData().feminine.count
  );

  // Métodos para actualizar datos (ejemplo)
  updateMasculineIncome(total: number, count: number) {
    this.incomeData.update(data => ({
      ...data,
      masculine: { total, count }
    }));
  }

  updateFeminineIncome(total: number, count: number) {
    this.incomeData.update(data => ({
      ...data,
      feminine: { total, count }
    }));
  }
}
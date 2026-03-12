import { Injectable } from '@angular/core';
import { RegistroData } from '../models/registro.models';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RegistroService {
  private data = new BehaviorSubject<RegistroData>({} as RegistroData);
  private step = new BehaviorSubject<number>(1);
  
  currentData$ = this.data.asObservable();
  currentStep$ = this.step.asObservable();
  
  updateData(data: Partial<RegistroData>) {
    this.data.next({ ...this.data.value, ...data });
  }
  
  nextStep() {
    this.step.next(this.step.value + 1);
  }
  
  prevStep() {
    this.step.next(this.step.value - 1);
  }
}
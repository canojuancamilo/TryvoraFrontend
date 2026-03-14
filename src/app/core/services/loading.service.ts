import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean> = this.loadingSubject.asObservable();
  
  // Contador para manejar múltiples peticiones simultáneas
  private requestsCount = 0;

  showLoading(): void {
    this.requestsCount++;
    if (this.requestsCount === 1) {
      this.loadingSubject.next(true);
    }
  }

  hideLoading(): void {
    this.requestsCount--;
    if (this.requestsCount === 0) {
      this.loadingSubject.next(false);
    }
  }

  resetLoading(): void {
    this.requestsCount = 0;
    this.loadingSubject.next(false);
  }
}
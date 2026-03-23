import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../interfaces/apis/IApiResponse';
import { IMetricasResponse } from '../../interfaces/apis/club/IMetricasResponse';

@Injectable({
  providedIn: 'root'
})
export class ClubApiService {
  protected baseUrl: string = `${environment.apiUrl}/Club`;
  protected apiKey: string = environment.apiKey;

  private http = inject(HttpClient);

  obtenerMetricas(clubId: number): Observable<IMetricasResponse> {
    return this.http
      .get<ApiResponse<IMetricasResponse>>(`${this.baseUrl}/Metricas/${clubId}`)
      .pipe(
        map(response => response.data)
      );
  }
}
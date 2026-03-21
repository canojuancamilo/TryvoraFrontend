import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, map, retry, timeout } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { IDepartamento } from '../../interfaces/apis/IDepartamento';
import { ApiResponse } from '../../interfaces/apis/IApiResponse';

@Injectable({
  providedIn: 'root'
})
export class CatalogosApiService {
  protected baseUrl: string = environment.apiUrl;
  protected apiKey: string = environment.apiKey;
  private http = inject(HttpClient);


  protected getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (this.apiKey) {
      headers = headers.set('X-API-Key', this.apiKey);
    }

    return headers;
  }

 obtenerDepartamentos(): Observable<IDepartamento[]> {
  return this.http
    .get<ApiResponse<IDepartamento[]>>(
      `${this.baseUrl}/Catalogos/Departamentos`,
      { headers: this.getHeaders() }
    )
    .pipe(
      map((resp) => resp.data as IDepartamento[])
    );
}
}
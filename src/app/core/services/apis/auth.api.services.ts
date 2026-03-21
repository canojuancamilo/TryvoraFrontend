import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../interfaces/apis/IApiResponse';
import { IRegistrarClub } from '../../interfaces/apis/auth/IRegistrarClub';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  protected baseUrl: string = `${environment.apiUrl}/Auth`;
  protected apiKey: string = environment.apiKey;

  private http = inject(HttpClient);

  protected getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (this.apiKey)
      headers = headers.set('X-API-Key', this.apiKey);

    return headers;
  }

  registrarClub(datos: IRegistrarClub): Observable<string> {
    debugger
    return this.http
      .post<ApiResponse<string>>(
        `${this.baseUrl}/RegistrarClub`, datos,
        { headers: this.getHeaders() }
      )
      .pipe(
        map((resp) => resp.serverResponse.mensaje)
      );
  }
}
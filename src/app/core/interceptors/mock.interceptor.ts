// src/app/core/interceptors/mock.interceptor.ts
// ¡IMPORTANTE! Este interceptor te permite desarrollar SIN BACKEND REAL
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable()
export class MockInterceptor implements HttpInterceptor {

  // Base de datos simulada
  private mockDb = {
    users: [
      { id: 1, name: 'Admin User', email: 'admin@test.com', role: 'admin' },
      { id: 2, name: 'Regular User', email: 'user@test.com', role: 'user' },
      { id: 3, name: 'Guest User', email: 'guest@test.com', role: 'guest' }
    ],
    products: [
      { id: 1, name: 'Laptop', price: 999.99, stock: 10 },
      { id: 2, name: 'Mouse', price: 29.99, stock: 50 },
      { id: 3, name: 'Keyboard', price: 89.99, stock: 25 }
    ]
  };

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
    // SIMULAR ENDPOINTS REST
    
    // GET /api/users
    if (request.url.includes('/api/users') && request.method === 'GET') {
      return of(new HttpResponse({
        status: 200,
        body: { success: true, data: this.mockDb.users }
      })).pipe(delay(500)); // Simular latencia
    }

    // GET /api/users/:id
    const getUserMatch = request.url.match(/\/api\/users\/(\d+)/);
    if (getUserMatch && request.method === 'GET') {
      const userId = parseInt(getUserMatch[1]);
      const user = this.mockDb.users.find(u => u.id === userId);
      
      if (user) {
        return of(new HttpResponse({
          status: 200,
          body: { success: true, data: user }
        })).pipe(delay(300));
      } else {
        return of(new HttpResponse({
          status: 404,
          body: { success: false, message: 'Usuario no encontrado' }
        })).pipe(delay(300));
      }
    }

    // POST /api/users (crear usuario)
    if (request.url.includes('/api/users') && request.method === 'POST') {
      const newUser = { ...(request.body as any), id: this.mockDb.users.length + 1 };
      this.mockDb.users.push(newUser);
      
      return of(new HttpResponse({
        status: 201,
        body: { success: true, data: newUser }
      })).pipe(delay(400));
    }

    // GET /api/products
    if (request.url.includes('/api/products') && request.method === 'GET') {
      return of(new HttpResponse({
        status: 200,
        body: { success: true, data: this.mockDb.products }
      })).pipe(delay(400));
    }

    // PUT /api/products/:id
    const putProductMatch = request.url.match(/\/api\/products\/(\d+)/);
    if (putProductMatch && request.method === 'PUT') {
      const productId = parseInt(putProductMatch[1]);
      const index = this.mockDb.products.findIndex(p => p.id === productId);
      
      if (index !== -1) {
        this.mockDb.products[index] = { ...this.mockDb.products[index], ...(request.body as any) };
        return of(new HttpResponse({
          status: 200,
          body: { success: true, data: this.mockDb.products[index] }
        })).pipe(delay(400));
      }
    }

    // DELETE /api/products/:id
    const deleteProductMatch = request.url.match(/\/api\/products\/(\d+)/);
    if (deleteProductMatch && request.method === 'DELETE') {
      const productId = parseInt(deleteProductMatch[1]);
      this.mockDb.products = this.mockDb.products.filter(p => p.id !== productId);
      
      return of(new HttpResponse({
        status: 200,
        body: { success: true, message: 'Producto eliminado' }
      })).pipe(delay(400));
    }

    // SIMULAR ERROR 500 para pruebas
    if (request.url.includes('/api/error-test')) {
      return of(new HttpResponse({
        status: 500,
        body: { success: false, message: 'Error simulado del servidor' }
      })).pipe(delay(300));
    }

    // Si no es una ruta mockeada, pasa al siguiente interceptor (o al backend real)
    return next.handle(request);
  }
}
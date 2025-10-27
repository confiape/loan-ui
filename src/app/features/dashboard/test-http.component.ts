import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../services/toast.service';

/**
 * Component to test HTTP interceptor functionality
 * This is a temporary component for testing purposes
 */
@Component({
  selector: 'app-test-http',
  standalone: true,
  template: `
    <div class="p-6 space-y-4">
      <h2 class="text-2xl font-bold mb-4">Test HTTP Interceptor</h2>

      <div class="space-y-2">
        <button class="btn btn-primary" (click)="testSuccessPost()">Test POST Success</button>

        <button class="btn btn-error" (click)="testError404()">Test 404 Error</button>

        <button class="btn btn-error" (click)="testError500()">Test 500 Error</button>

        <button class="btn btn-success" (click)="testManualToast()">Test Manual Toast</button>
      </div>

      <div class="mt-4 p-4 bg-gray-100 rounded">
        <h3 class="font-bold mb-2">Instrucciones:</h3>
        <ul class="list-disc list-inside space-y-1 text-sm">
          <li>POST Success: Simula una operación exitosa (muestra toast de éxito)</li>
          <li>404 Error: Simula un error 404 (muestra toast de error)</li>
          <li>500 Error: Simula un error 500 (muestra toast de error)</li>
          <li>Manual Toast: Muestra un toast directamente desde el servicio</li>
        </ul>
      </div>
    </div>
  `,
})
export class TestHttpComponent {
  private http = inject(HttpClient);
  private toastService = inject(ToastService);

  testSuccessPost(): void {
    // Using JSONPlaceholder API for testing
    this.http
      .post('https://jsonplaceholder.typicode.com/posts', {
        title: 'Test Post',
        body: 'This is a test',
        userId: 1,
      })
      .subscribe({
        next: (response) => {
          console.log('Success:', response);
        },
        error: (error) => {
          console.error('Error:', error);
        },
      });
  }

  testError404(): void {
    // This will trigger a 404 error
    this.http.get('https://jsonplaceholder.typicode.com/posts/99999999').subscribe({
      next: (response) => {
        console.log('Response:', response);
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
  }

  testError500(): void {
    // Simulating a 500 error with a non-existent endpoint
    this.http.get('https://httpstat.us/500').subscribe({
      next: (response) => {
        console.log('Response:', response);
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
  }

  testManualToast(): void {
    this.toastService.success('¡Operación manual exitosa!', 'Éxito');
    setTimeout(() => {
      this.toastService.info('Este es un mensaje informativo', 'Info');
    }, 500);
    setTimeout(() => {
      this.toastService.warning('Advertencia de prueba', 'Advertencia');
    }, 1000);
  }
}

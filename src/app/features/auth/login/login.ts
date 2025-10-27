import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthenticationApiService } from '../../../core/openapi/api/authentication.service';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { LoginDto } from '../../../core/openapi/model/loginDto';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
})
export class LoginComponent {
  private router = inject(Router);
  private authApi = inject(AuthenticationApiService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  // Form state
  email = signal('');
  password = signal('');
  isLoading = signal(false);
  showPassword = signal(false);

  onSubmit(): void {
    if (this.isLoading()) return;

    const loginDto: LoginDto = {
      email: this.email(),
      password: this.password(),
    };

    this.isLoading.set(true);

    this.authApi.logIn(loginDto).subscribe({
      next: () => {
        // Login successful, get authorization token
        this.authService.getAuthorizationToken().subscribe({
          next: () => {
            this.toastService.success('Inicio de sesión exitoso');
            this.router.navigate(['/dashboard']);
          },
          error: (error) => {
            console.error('Error getting authorization token:', error);
            this.toastService.error('Error al obtener el token de autorización');
            this.isLoading.set(false);
          },
        });
      },
      error: (error) => {
        console.error('Login error:', error);
        const errorMessage = error.error?.message || 'Email o contraseña incorrectos';
        this.toastService.error(errorMessage, 'Error de Autenticación');
        this.isLoading.set(false);
      },
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((v) => !v);
  }
}

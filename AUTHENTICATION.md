# Sistema de Autenticación

Sistema completo de autenticación basado en JWT con refresh automático de tokens y manejo de errores.

## Arquitectura

### Flujo de Autenticación

```
1. Usuario accede a la app
   ├─> AuthInterceptor verifica autenticación (isAuthenticated)
   ├─> Si no está autenticado → Redirige a /login
   └─> Si está autenticado → Continúa

2. Login exitoso
   ├─> logIn() → JWT guardado en cookies (httpOnly)
   ├─> getAuthorizationToken() → Obtiene accessToken
   └─> accessToken guardado en AuthService

3. Requests autenticados
   ├─> AuthInterceptor agrega header: Authorization: Bearer <token>
   └─> Request procede normalmente

4. Token expirado (401/403)
   ├─> TokenRetryInterceptor captura el error
   ├─> Llama a refreshToken() → getAuthorizationToken()
   ├─> Si funciona → Reintenta request original con nuevo token
   └─> Si falla → Muestra alerta + Redirige a /login
```

## Componentes del Sistema

### 1. AuthService (`src/app/services/auth.service.ts`)

Servicio principal que gestiona el estado de autenticación y tokens.

**Signals:**
- `accessToken`: Token de autorización actual
- `isAuthenticatedSignal`: Estado de autenticación
- `isRefreshing`: Control de refresh en progreso

**Métodos principales:**
```typescript
// Obtener token actual
getToken(): string | null

// Establecer token
setToken(token: string): void

// Limpiar token
clearToken(): void

// Verificar autenticación con API
checkAuthentication(): Observable<boolean>

// Obtener token de autorización
getAuthorizationToken(): Observable<LoginResponse>

// Refrescar token expirado
refreshToken(): Observable<LoginResponse>

// Navegar a login
navigateToLogin(): void

// Cerrar sesión
logout(): Observable<void>
```

### 2. AuthInterceptor (`src/app/interceptors/auth.interceptor.ts`)

Interceptor que:
- Verifica autenticación antes de cada request
- Agrega el token Bearer a los headers
- Redirige a login si no está autenticado
- Excluye endpoints públicos

**Endpoints Públicos (no requieren auth):**
```typescript
'/api/Authentication/IsAuthenticated'
'/api/Authentication/LoginWithGoogleToken'
'/api/Authentication/GetAuthorizationToken'
'/api/Authentication/LogIn'
'/api/Authentication/LogOut'
```

### 3. TokenRetryInterceptor (`src/app/interceptors/token-retry.interceptor.ts`)

Interceptor que:
- Captura errores 401 y 403
- Intenta refrescar el token automáticamente
- Reintenta la petición original con el nuevo token
- Si el refresh falla:
  - Muestra toast de error "Sin Permisos"
  - Redirige a login

### 4. LoginComponent (`src/app/features/auth/login/`)

Componente de login con:
- ✅ Formulario reactivo con signals
- ✅ Validación de campos
- ✅ Toggle de visibilidad de contraseña
- ✅ Estado de loading
- ✅ Diseño responsive con design system
- ✅ Manejo de errores con toasts

## Uso

### Login desde el componente

```typescript
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { AuthenticationApiService } from './core/openapi/api/authentication.service';

export class MyComponent {
  private authApi = inject(AuthenticationApiService);
  private authService = inject(AuthService);

  login(email: string, password: string) {
    this.authApi.logIn({ email, password }).subscribe({
      next: () => {
        // Login exitoso, obtener token de autorización
        this.authService.getAuthorizationToken().subscribe({
          next: () => {
            // Token guardado, navegar al dashboard
            this.router.navigate(['/dashboard']);
          }
        });
      },
      error: (error) => {
        console.error('Login failed:', error);
      }
    });
  }
}
```

### Logout

```typescript
import { AuthService } from './services/auth.service';

export class MyComponent {
  private authService = inject(AuthService);

  logout() {
    this.authService.logout().subscribe(() => {
      // Usuario deslogueado y redirigido a /login
    });
  }
}
```

### Verificar estado de autenticación

```typescript
import { AuthService } from './services/auth.service';

export class MyComponent {
  private authService = inject(AuthService);

  ngOnInit() {
    // Signal reactivo
    const isAuth = this.authService.isAuthenticated$();
    console.log('Authenticated:', isAuth);

    // Verificar con API
    this.authService.checkAuthentication().subscribe(isAuth => {
      console.log('API check:', isAuth);
    });
  }
}
```

## Configuración

### Interceptores registrados en `app.config.ts`

```typescript
provideHttpClient(
  withInterceptors([
    authInterceptor,              // 1. Verifica auth y agrega token
    tokenRetryInterceptor,        // 2. Maneja tokens expirados
    httpNotificationInterceptor,  // 3. Muestra notificaciones
  ])
)
```

**⚠️ IMPORTANTE:** El orden de los interceptores es crítico:
1. Primero `authInterceptor` verifica y agrega el token
2. Luego `tokenRetryInterceptor` maneja renovaciones
3. Finalmente `httpNotificationInterceptor` muestra mensajes

### Rutas

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent, // Ruta pública
  },
  {
    path: '',
    component: MainLayout,
    // canActivate: [authGuard], // Opcional: proteger con guard
    children: [
      { path: 'dashboard', component: Dashboard },
      // ... otras rutas protegidas
    ],
  },
];
```

## API Endpoints (OpenAPI)

### `POST /api/Authentication/LogIn`
Login de usuario. Retorna JWT en cookies httpOnly.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### `POST /api/Authentication/GetAuthorizationToken`
Obtiene el token de autorización usando el JWT de cookies.

**Response:**
```json
{
  "user": { ... },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "tokenType": "Bearer"
}
```

### `GET /api/Authentication/IsAuthenticated`
Verifica si el usuario está autenticado.

**Response:**
```json
true
```

### `GET /api/Authentication/LogOut`
Cierra la sesión del usuario.

### `POST /api/Authentication/RefreshAuthenticationToken`
Refresca el token de autenticación (no usado actualmente, se usa `getAuthorizationToken`).

## Casos de Uso

### Caso 1: Usuario no autenticado intenta acceder al dashboard

```
1. Usuario navega a /dashboard
2. AuthInterceptor intercepta el request
3. Verifica isAuthenticated() → false
4. Redirige a /login
```

### Caso 2: Token expira durante una operación

```
1. Usuario hace un request (ej: GET /api/loans)
2. Server responde con 401 Unauthorized
3. TokenRetryInterceptor intercepta el error
4. Llama a getAuthorizationToken() para obtener nuevo token
5. Si éxito:
   - Reintenta el request original con nuevo token
   - Request se completa normalmente
6. Si falla:
   - Muestra toast: "No tienes permisos o tu sesión ha expirado"
   - Redirige a /login
```

### Caso 3: Login exitoso

```
1. Usuario completa formulario de login
2. Componente llama a authApi.logIn()
3. Server guarda JWT en cookies httpOnly
4. Componente llama a authService.getAuthorizationToken()
5. Server retorna accessToken
6. AuthService guarda el token en signal
7. Usuario es redirigido a /dashboard
8. Todos los requests subsecuentes incluyen: Authorization: Bearer <token>
```

## Seguridad

### Protecciones Implementadas

✅ **JWT en cookies httpOnly**: El JWT principal está en cookies, protegido contra XSS

✅ **Access Token en memoria**: El accessToken se guarda solo en memoria (signals), no en localStorage

✅ **HTTPS only**: Todas las cookies deben configurarse con `secure: true` en producción

✅ **Refresh automático**: Los tokens se renuevan automáticamente sin intervención del usuario

✅ **Single refresh**: Control con `isRefreshing` para evitar múltiples refreshes simultáneos

✅ **Logout limpio**: Limpia tanto el server (cookies) como el client (signals)

### Recomendaciones Adicionales

1. **Configurar cookies en el servidor:**
```csharp
options.Cookie.HttpOnly = true;
options.Cookie.Secure = true; // HTTPS only
options.Cookie.SameSite = SameSiteMode.Strict;
```

2. **Implementar CSRF protection** para requests que modifican datos

3. **Agregar rate limiting** en endpoints de autenticación

4. **Implementar auto-logout** después de inactividad:
```typescript
// En AuthService
private setupAutoLogout() {
  const TIMEOUT = 30 * 60 * 1000; // 30 minutos
  let timeoutId: number;

  const resetTimer = () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => this.logout(), TIMEOUT);
  };

  // Resetear en actividad del usuario
  ['click', 'keypress', 'scroll'].forEach(event => {
    document.addEventListener(event, resetTimer);
  });
}
```

## Testing

### Testing del AuthService

```typescript
import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('should set and get token', () => {
    service.setToken('test-token');
    expect(service.getToken()).toBe('test-token');
    expect(service.isAuthenticated$()).toBe(true);
  });

  it('should clear token', () => {
    service.setToken('test-token');
    service.clearToken();
    expect(service.getToken()).toBeNull();
    expect(service.isAuthenticated$()).toBe(false);
  });
});
```

### Testing de Interceptores

Ver `src/app/interceptors/http-notification.interceptor.spec.ts` como ejemplo.

## Troubleshooting

### "Not authenticated" loop

**Problema:** La app redirige constantemente a login.

**Solución:** Verificar que:
1. El JWT se está guardando correctamente en las cookies
2. Las cookies tienen el dominio correcto
3. El endpoint `isAuthenticated` retorna `true`

### Token no se agrega a los headers

**Problema:** Los requests no tienen el header `Authorization`.

**Solución:** Verificar que:
1. El `authInterceptor` está registrado en `app.config.ts`
2. Se llamó a `getAuthorizationToken()` después del login
3. El token se guardó en `AuthService`

### Refresh infinito

**Problema:** El interceptor intenta refrescar el token infinitamente.

**Solución:** Verificar que:
1. `getAuthorizationToken` no está en la lista `NO_RETRY_ENDPOINTS`
2. El control `isRefreshing` funciona correctamente
3. Los errores de refresh se manejan adecuadamente

## Archivos del Sistema

```
src/app/
├── services/
│   └── auth.service.ts              # Servicio de autenticación
├── interceptors/
│   ├── auth.interceptor.ts          # Interceptor de autenticación
│   ├── token-retry.interceptor.ts   # Interceptor de retry
│   └── http-notification.interceptor.ts  # Notificaciones
├── features/
│   └── auth/
│       └── login/
│           ├── login.component.ts   # Componente de login
│           ├── login.component.html # Template
│           └── login.component.css  # Estilos
├── core/
│   └── openapi/                     # Servicios generados
│       └── api/
│           └── authentication.service.ts
├── app.config.ts                    # Configuración de interceptores
└── app.routes.ts                    # Rutas con login
```

## Próximos Pasos

- [ ] Agregar guard de autenticación para rutas protegidas
- [ ] Implementar "Remember Me" funciona lity
- [ ] Agregar recuperación de contraseña
- [ ] Implementar login con Google (ya existe endpoint)
- [ ] Agregar auto-logout por inactividad
- [ ] Agregar tests unitarios completos
- [ ] Agregar tests E2E con Playwright

---

**Documentación creada:** Octubre 2025
**Última actualización:** Octubre 2025

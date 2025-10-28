# Guards

Los guards son funciones que controlan el acceso a rutas en la aplicación. Este proyecto utiliza **functional guards** siguiendo las mejores prácticas de Angular 20.

## Guards Disponibles

### 1. AuthGuard (`auth.guard.ts`)

Protege rutas que requieren autenticación. Si el usuario no está autenticado, será redirigido a la página de login.

**Características:**

- Verifica si el usuario tiene un token de acceso
- Si no hay token, consulta el API para verificar autenticación
- Redirige al login con el parámetro `returnUrl` para volver después del login
- Maneja errores de autenticación de forma segura

**Uso:**

```typescript
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
];
```

**Flujo:**

1. Verifica si existe un token en memoria
2. Si hay token → Permite acceso
3. Si no hay token → Llama a `checkAuthentication()` del `AuthService`
4. Si está autenticado → Intenta obtener token de autorización
5. Si no está autenticado → Redirige a `/login?returnUrl=/ruta-actual`

---

### 2. LoginGuard (`login.guard.ts`)

Previene que usuarios autenticados accedan a la página de login. Si el usuario ya está autenticado, será redirigido al dashboard.

**Características:**

- Verifica si el usuario ya tiene un token de acceso
- Si está autenticado, redirige al dashboard
- Permite acceso al login solo si no hay autenticación

**Uso:**

```typescript
import { loginGuard } from './guards/login.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [loginGuard],
  },
];
```

**Flujo:**

1. Verifica si existe un token en memoria
2. Si hay token → Redirige a `/dashboard`
3. Si no hay token → Llama a `checkAuthentication()` del `AuthService`
4. Si está autenticado → Redirige a `/dashboard`
5. Si no está autenticado → Permite acceso al login

---

## Configuración en Rutas

Ejemplo de configuración completa en `app.routes.ts`:

```typescript
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { loginGuard } from './guards/login.guard';

export const routes: Routes = [
  // Login - Solo accesible si no está autenticado
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [loginGuard],
  },

  // Rutas protegidas - Solo accesibles si está autenticado
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },
    ],
  },
];
```

---

## Dependencias

Ambos guards dependen de:

- **AuthService** (`src/app/services/auth.service.ts`): Maneja la autenticación y tokens
- **Router**: Para redirecciones

---

## Testing

Cada guard tiene su suite de tests completa:

- `auth.guard.spec.ts`: Tests para AuthGuard
- `login.guard.spec.ts`: Tests para LoginGuard

Ejecutar tests:

```bash
npm test
```

---

## Consideraciones de Seguridad

1. **Nunca confiar solo en guards del cliente**: Los guards son una capa de UI/UX, no de seguridad. El backend debe validar todos los permisos.

2. **Tokens en memoria**: Los guards verifican tokens almacenados en memoria (signals), no en localStorage por seguridad.

3. **Validación del API**: Los guards siempre consultan al API para verificar autenticación cuando no hay token.

4. **Manejo de errores**: Todos los errores de autenticación redirigen al login de forma segura.

---

## Buenas Prácticas

1. **Functional Guards**: Usamos functional guards en lugar de class-based guards (Angular 20).

2. **Observables**: Los guards retornan `Observable<boolean>` cuando necesitan hacer llamadas asíncronas.

3. **Type Safety**: Uso de `isObservable()` para type narrowing en tests.

4. **Return URL**: El AuthGuard preserva la URL destino para redirigir después del login.

---

## Arquitectura

```
Usuario intenta acceder a /dashboard
         ↓
    AuthGuard
         ↓
   ¿Hay token? ─── Sí ──→ Permite acceso
         │
        No
         ↓
   checkAuthentication()
         ↓
   ¿Autenticado? ─── Sí ──→ getAuthorizationToken() → Permite acceso
         │
        No
         ↓
   Redirige a /login?returnUrl=/dashboard
```

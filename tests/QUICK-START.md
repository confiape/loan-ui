# Quick Start - Playwright E2E

Guía rápida para ejecutar los tests.

## Primera Vez

```bash
# Instalar navegadores (solo primera vez)
npx playwright install chromium
```

## Comandos Básicos

```bash
# Modo UI - Recomendado para desarrollo
npm run test:e2e:ui

# Ejecutar todos los tests (headless)
npm run test:e2e

# Ver navegador mientras corre
npm run test:e2e:headed

# Debug paso a paso
npm run test:e2e:debug

# Ver último reporte
npm run test:e2e:report
```

## Ejecutar Tests Específicos

```bash
# Solo auth tests
npx playwright test auth

# Solo companies CRUD
npx playwright test companies

# Un solo archivo
npx playwright test tests/e2e/auth/login.spec.ts

# Un test específico por nombre
npx playwright test -g "should create"
```

## Durante Desarrollo

**Mejor workflow:**

1. `npm run test:e2e:ui` - Abre UI mode
2. Selecciona el test que quieres ejecutar
3. Ve ejecución en tiempo real
4. Time-travel debugging automático
5. Inspecciona locators con click

## Troubleshooting

**Server no inicia:**

```bash
# Iniciar manualmente en otra terminal
npm start

# Luego ejecutar tests
npm run test:e2e
```

**Tests muy lentos:**

```bash
# Ejecutar solo chromium (más rápido)
npx playwright test --project=chromium
```

**Ver qué está pasando:**

```bash
# Headed mode muestra el navegador
npm run test:e2e:headed
```

## Archivos Importantes

- `playwright.config.ts` - Configuración global
- `tests/fixtures/mock-data.ts` - Cambiar credenciales aquí
- `tests/e2e/cruds/companies.spec.ts` - Template CRUD
- `tests/README.md` - Documentación completa

## Crear Nuevo Test

```bash
# 1. Copiar template
cp tests/e2e/cruds/companies.spec.ts tests/e2e/cruds/my-entity.spec.ts

# 2. Copiar page objects
cp tests/pages/companies-list.page.ts tests/pages/my-entity-list.page.ts
cp tests/pages/company-form.page.ts tests/pages/my-entity-form.page.ts

# 3. Buscar/Reemplazar en los archivos:
#    Company → MyEntity
#    companies → my-entities

# 4. Ejecutar
npm run test:e2e:ui
```

## Tips

- **UI Mode** es tu mejor amigo para desarrollo
- **Debug mode** para investigar fallos
- **Headed mode** para ver el navegador en acción
- Ver screenshots/videos en `test-results/` cuando fallan

## CI/CD

El config ya está listo para CI:

- Auto-retries en fallos
- Screenshots/videos automáticos
- Ejecuta en paralelo cuando es posible

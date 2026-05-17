# MC Diet Planner

Esta es una aplicación React creada con Vite para simular un plan de dietas.

La app permite:

- iniciar sesión o registrar un usuario en el navegador
- configurar datos de dieta y niveles de comidas
- ejecutar una simulación de 100 días con Monte Carlo
- ver gráficos de peso, calorías y proteína
- generar un plan diario de desayuno, almuerzo y cena

## Archivos importantes

- `src/App.jsx`: controla las páginas principales y el estado de la aplicación.
- `src/components/LoginPage.jsx`: formulario de inicio de sesión y registro.
- `src/components/SetupPage.jsx`: pantalla de configuración, pasos y simulación.
- `src/components/Dashboard.jsx`: muestra los resultados y el plan diario.
- `src/hooks/useMonteCarlo.js`: hook personalizado que ejecuta la simulación.
- `src/utils/authUtils.js`: maneja login y registro con `localStorage`.

## Cómo usar

Instala dependencias y ejecuta el proyecto:

```bash
npm install
npm run dev
```

Para construir la versión de producción:

```bash
npm run build
```

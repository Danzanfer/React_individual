# Memoria del Proyecto React Diet Planner

Este proyecto es una aplicación de dieta construida con React y Vite. Su función principal es permitir que un usuario configure parámetros de alimentación, ejecute una simulación MonteCarlo de 100 días y vea una recomendación diaria de comidas con calorías y proteína.

La simulación MonteCarlo se usa para generar resultados con un componente aleatorio: el sistema selecciona comidas según los niveles definidos y decide si una cena es "culposa" en función de una probabilidad. El objetivo es producir una proyección de peso y macro nutrientes sin que el resultado sea siempre el mismo.

## Estructura general

El código está organizado en `src/` con varios componentes principales:

- `App.jsx`: controla el flujo de la aplicación entre páginas. No usa un router externo, sino un estado local `page` que cambia entre `login`, `setup`, `simulation` y `dashboard`.
- `src/components/LoginPage.jsx`: maneja el ingreso de usuario y el registro. Recibe una función `onSuccess` que actualiza el email del usuario y avanza a la página de setup.
- `src/components/SetupPage.jsx`: permite al usuario ingresar datos iniciales y elegir la frecuencia de comidas por nivel (`high`, `medium`, `low`). Tiene dos pasos internos con pestañas y la opción de simular.
- `src/components/Dashboard.jsx`: muestra el plan diario y permite generar otra recomendación de día a partir de los resultados ya simulados.

Además hay componentes de apoyo como `MetricInput.jsx`, `WeightChart.jsx`, `ProteinChart.jsx` y `MacroSummary.jsx`.

## Manejo de múltiples páginas

La navegación no se realiza con librerías como React Router. En `App.jsx` se usa `useState` para mantener el valor de `page` y se renderiza un componente distinto según ese valor:

- `login` muestra `LoginPage`
- `setup` muestra `SetupPage`
- `dashboard` muestra `Dashboard`
- El estado por defecto después de simular muestra la vista de `simulation` con gráficos y un botón para aprobar y pasar al dashboard.

De esta forma el proyecto mantiene un flujo simple y predecible.

## Autenticación y login

La autenticación se maneja con `src/utils/authUtils.js`. Ahí se usan funciones que leen y escriben usuarios en `localStorage`:

- `registerUser(email, password)`: crea una cuenta nueva guardando el email y un hash SHA-256 de la contraseña.
- `authenticateUser(email, password)`: compara el email y el hash de la contraseña con los usuarios guardados.

En `LoginPage.jsx`, el formulario alterna entre modo registro e inicio de sesión. Si el login es válido, llama `onSuccess(email)` y el estado en `App.jsx` cambia a `setup`.

## Simulación de dieta

La lógica de simulación está en el hook `useMonteCarlo`:

- Toma los datos de configuración: peso inicial, calorías de mantenimiento, calorías activas, probabilidad de cena culposa y frecuencias de tier.
- Usa una simulación Monte Carlo para generar 100 días de resultados. Esto significa que se eligen comidas de forma probabilística según los niveles `high`, `medium` y `low`, y se introduce aleatoriedad en la cena culposa.
- Para cada día, calcula desayuno, almuerzo y cena, suma calorías y proteínas, y ajusta el peso con `calculateWeightChange`.
- Devuelve `results`, `loading` y `runSimulation`, lo que permite controlar la ejecución desde `App.jsx`.

El hook mantiene el estado de resultados y de carga, y lo usa `App.jsx` para mostrar los gráficos y luego el dashboard.

## Componentes clave usados

- `App.jsx`: controla el flujo de pantalla y el estado principal de la aplicación. Usa `useState` para `page`, `userEmail` y `setupConfig`, y decide qué componente mostrar.
- `LoginPage.jsx`: componente de autenticación que usa `useState` para manejar email, contraseña, modo registro/inicio y mensajes de error.
- `SetupPage.jsx`: usa `useState` para la pestaña activa y los ejemplos, y actualiza la configuración del usuario mediante `onChange`.
- `Dashboard.jsx`: usa `useEffect` para cargar automáticamente la primera recomendación cuando llegan los resultados de la simulación y permite generar otra recomendación diaria.
- `useMonteCarlo.js`: hook personalizado que ejecuta la simulación de 100 días, mantiene `loading` y `results`, y expone `runSimulation` para el resto de la app.
- `MetricInput.jsx`: componente reutilizable para campos numéricos del formulario de setup.
- `WeightChart.jsx` y `ProteinChart.jsx`: componentes de visualización que muestran los resultados de la simulación en gráficos.
- `MacroSummary.jsx`: componente de resumen rápido de macro nutrientes y datos de la simulación.

## Estilo y presentación

Los estilos están centralizados en `src/App.css`. La aplicación está diseñada móvil primero, con media queries que mejoran la presentación en pantallas anchas.

Se trabajó en:

- mejorar contraste y legibilidad en el header
- dejar las cajas de resumen en blanco para destacarlas
- mantener la consistencia visual en el dashboard y en la configuración
- limpiar reglas CSS duplicadas sin cambiar la apariencia

## Estado actual

El proyecto está limpio y funcional. El build con `npm run build` se compila correctamente.

La app ya permite:

- autenticar usuarios con registro y login local
- configurar datos de dieta y frecuencias de comidas
- correr una simulación de 100 días
- ver un resumen de peso, calorías y proteína
- mostrar un plan diario con desayuno, almuerzo y cena

## Comentario final

Este proyecto es una aplicación de React simple, organizada en pocos componentes y con un flujo de páginas controlado por estado. La autenticación se hace en el navegador usando `localStorage`, y la simulación de dieta se ejecuta en un hook dedicado para mantener el código más modular.

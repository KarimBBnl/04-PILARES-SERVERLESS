# Bloque 05

## Resultado

Se construyó la aplicación cliente en la carpeta `mobile` con React Native (Expo SDK 54) para web. La pantalla muestra el catálogo local con dos actuaciones iniciales (`EVT-101` y `EVT-102`) y permite interactuar con un botón para cambiar la selección mediante estado local en `useState`.

### Comprobación de TypeScript y arranque

```text
npm run typecheck
> festival-control-mobile@1.0.0 typecheck
> tsc --noEmit

npm run web
Starting project at .../mobile
Waiting on http://localhost:8081
Web Bundled (179 modules)
```

### Estado inicial de la interfaz

```text
Pantalla: http://localhost:8081

FESTIVAL CONTROL
Programación
Datos locales · todavía sin llamadas HTTP

EVT-101 · CONFIRMED
Neon Waves
Main Stage · 22:30

EVT-102 · CONFIRMED
Midnight Session
Club Stage · 23:45

Botón: Seleccionar EVT-101
Selección: ninguna
```

### Interacción y cambio de estado

Al pulsar el botón `Seleccionar EVT-101`:

```text
Acción: Clic en "Seleccionar EVT-101"
Resultado en pantalla:
Selección: EVT-101
```

Al recargar el navegador (F5):

```text
Acción: Recargar página
Resultado en pantalla:
Selección: ninguna
```

### Cambio guiado

Se probó cambiar el botón y el setter a `EVT-102`:

```text
Acción: Clic en "Seleccionar EVT-102"
Resultado en pantalla:
Selección: EVT-102
```

La selección se reinicia al recargar porque el estado reside únicamente en la memoria local del componente (`useState`) y en este bloque todavía no se realizan llamadas HTTP ni persistencia con el backend.

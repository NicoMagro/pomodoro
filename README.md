# Pomodoro + Spotify

Aplicación fullstack Pomodoro con Node.js (Express) y React, integración de sonidos y Spotify.

## Estructura

- `server/`: Backend Node.js (Express)
- `client/`: Frontend React

## Funcionalidades actuales

- Temporizador Pomodoro personalizable (tiempos, descansos, ciclos).
- Modal de configuración.
- Cambios de color según modo (trabajo, descanso corto, descanso largo).
- Sonidos distintos para trabajo y descanso (colocar archivos en `client/public/work.mp3` y `client/public/break.mp3`).
- Diseño responsivo y amigable.

## Próximos pasos

- Integrar autenticación y reproducción de música con Spotify.

## Instalación y uso

1. Instala dependencias en ambos proyectos:
   ```sh
   cd server && npm install
   cd ../client && npm install
   ```
2. Inicia el frontend:
   ```sh
   cd client
   npm start
   ```
3. (Próximamente) Inicia el backend para Spotify:
   ```sh
   cd server
   npm start
   ```

## Notas

- Los sonidos deben ser archivos `.mp3` válidos.
- Puedes personalizar los sonidos reemplazando los archivos en `client/public/`.

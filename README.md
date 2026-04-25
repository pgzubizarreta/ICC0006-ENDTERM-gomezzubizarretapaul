# Campus Quest App

Proyecto realizado para la practica M08/0489 ENDTERM con Ionic + Angular.

## Descripcion

Campus Quest combina dos partes dentro de una misma aplicacion:

- Una pantalla de tareas conectada a la API publica `https://jsonplaceholder.typicode.com/todos`.
- Un minijuego academico donde el jugador recoge retos para sumar puntos y esquiva obstaculos.

La aplicacion integra Firebase para guardar tareas y puntuaciones finales del juego, y muestra un
ranking en la pantalla principal.

## Tecnologias utilizadas

- Ionic
- Angular
- TypeScript
- SCSS
- Capacitor
- Firebase / Cloud Firestore
- Git y GitHub

## Funcionalidades implementadas

- Carga de tareas desde API publica.
- Servicio inyectable para separar la logica de datos.
- Pantalla principal con listado de tareas, resumen y refresco.
- Compartir tarea con `@capacitor/share`.
- Guardado de tareas en Firestore.
- Pantalla inicial del juego.
- Pantalla de juego con movimiento, puntuacion y colisiones.
- Pausa, reanudacion y reinicio de partida.
- Pantalla de Game Over.
- Guardado de puntuaciones finales en Firestore.
- Ranking visible en la app con las mejores puntuaciones.

## Checklist del enunciado

### Git y documentacion

- [x] Repositorio remoto en GitHub
- [x] Commits frecuentes y descriptivos
- [x] README.md completo y descriptivo

### Apartado 1 - Campus Quest App

- [x] Implementar pantallas y componentes planteados
- [x] Navegacion entre pantallas
- [x] Recuperar datos de la API publica de tareas
- [x] Utilizar servicios inyectables para separar la logica de la API
- [x] Configurar Firebase en la app
- [x] Implementar Firebase para almacenar datos
- [x] Configurar plugin de compartir de Ionic para enviar el nombre de la tarea

### Apartado 2 - Juego

- [x] Pantalla de inicio con boton para empezar la partida
- [x] Pantalla del juego
- [x] Pantalla de Game Over
- [x] Logica de movimiento
- [x] Logica de generacion de obstaculos y retos
- [x] Puntuacion visible durante la partida
- [x] Logica de reinicio, pausado y reanudacion
- [x] Fin de partida al tercer choque
- [x] Integracion del juego dentro de la app

## Estructura principal

```text
src/app/
  home/
  game/
  services/
    task.service.ts
    firebase-task-store.service.ts
    firebase-score.service.ts
```

## Firebase

La app utiliza dos colecciones en Cloud Firestore:

- `savedTasks`: tareas guardadas desde la pantalla principal.
- `gameScores`: puntuaciones finales guardadas desde Game Over.

## Ejecucion del proyecto

```bash
npm install
ionic serve
```

## Estado final

Proyecto funcional con tareas, Firebase, compartir, juego y ranking integrados dentro de una misma
aplicacion.

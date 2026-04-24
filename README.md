# Campus Quest App

Proyecto realizado para la practica M08/0489 ENDTERM.

## Descripcion

Campus Quest es una aplicacion desarrollada con Ionic + Angular. La app combina una pantalla de tareas con un juego sencillo para incentivar el uso de la aplicacion mediante puntos y ranking.

## Funcionalidades previstas

- Recuperar tareas desde la API publica `https://jsonplaceholder.typicode.com/todos`.
- Separar la logica de datos en servicios inyectables.
- Mostrar tareas y estado de cada tarea en la interfaz.
- Configurar Firebase y guardar datos de la aplicacion.
- Compartir el nombre de una tarea con el plugin nativo de Ionic/Capacitor.
- Incluir un juego con pantalla de inicio, partida, pausa, reinicio y Game Over.

## Estado actual

- Proyecto Ionic + Angular creado.
- Repositorio Git inicializado y conectado a GitHub.
- Pantalla principal de tareas conectada a la API publica.
- Opcion para compartir tareas con el plugin de Capacitor Share.
- SDK de Firebase instalado y servicio preparado para guardar tareas en Firestore.
- Pantalla de inicio del juego con navegacion desde tareas.
- Juego con puntuacion, obstaculos, pausa, reinicio y pantalla de Game Over.
- Guardado de puntuaciones finales del juego en Firebase.

## Tecnologias utilizadas

- Ionic
- Angular
- TypeScript
- SCSS
- Capacitor
- Git y GitHub
- Firebase

## Ejecucion del proyecto

```bash
npm install
ionic serve
```

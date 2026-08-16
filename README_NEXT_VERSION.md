# Ideas para la proxima version

## Prioridad alta

- Hecho: separar nucleo testeable inicial en `src/game/core.js` para mundo, fisica base, player, enemigos, audio y progreso.
- Hecho: el QA automatizado ahora usa el mismo nucleo que la app.
- Hecho: agregar modo debug opcional con hitboxes, posicion del jugador, entidades y estado del power-up.
- Hecho: guardar progreso con mas detalle: nivel desbloqueado, mejores puntajes, notas recolectadas y musica activada.
- Pendiente de endurecer: agregar pruebas automaticas mas profundas de colisiones, respawn, power-ups, enemigos y final de nivel.
- Pendiente de endurecer: separar render en sprites/escenas cuando pasemos a la etapa de arte.

## Jugabilidad

- Agregar tutorial corto en el nivel 1 con bloques faciles, un mate visible y un enemigo de practica.
- Convertir las plataformas flotantes en rutas alternativas con recompensas, no en camino obligatorio.
- Ajustar dificultad por grupos de canciones: facil 1-5, medio 6-10, dificil 11-15.
- Agregar checkpoints visuales antes de zonas con enemigos o saltos opcionales.
- Mejorar el game feel con coyote time, salto variable y pequenas particulas al caer o tomar mate.

## Arte y presentacion

- Hacer sprites por cuadro en una spritesheet pixel art en vez de dibujarlos solo con rectangulos.
- Crear animaciones separadas para idle, correr, saltar, tomar mate, recibir golpe y llegar al Obelisco.
- Mejorar los fondos con mas capas parallax y objetos identificables por cancion.
- Agregar una pantalla de inicio con seleccion de nivel, volumen y estado de audio.

## Audio

- Agregar control de volumen dentro del juego.
- Guardar si la musica esta prendida o apagada.
- Hacer fade-in/fade-out al cambiar de nivel.
- Permitir archivos `.mp3`, `.ogg` o `.wav` con deteccion automatica.

# Ideas para la proxima version

## Prioridad alta

- Hecho: separar nucleo testeable inicial en `src/game/core.js` para mundo, fisica base, player, enemigos, audio y progreso.
- Hecho: el QA automatizado ahora usa el mismo nucleo que la app.
- Hecho: agregar modo debug oculto para QA con hitboxes, posicion del jugador, entidades y estado del power-up.
- Hecho: guardar progreso con mas detalle: nivel desbloqueado, mejores puntajes, notas recolectadas y musica activada.
- Hecho: agregar pruebas automaticas mas profundas de colisiones, respawn, power-ups, enemigos y final de nivel.
- Hecho: reforzar hitbox de plataformas, muros y enemigos para evitar rendijas y paredes atravesables.
- Hecho: separar render del protagonista en spritesheet logica con frames animados.
- Hecho: convertir plataformas elevadas en one-way reales para evitar bug al pasar por debajo.
- Hecho: bloquear dano de enemigos cuando una plataforma separa al enemigo y a Milo.

## Jugabilidad

- Agregar tutorial corto en el nivel 1 con bloques faciles, un mate visible y un enemigo de practica.
- Hecho: algunos niveles medios y avanzados obligan a subir por plataformas mediante muros de escenario.
- Hecho: cerrar rendijas entre muros y plataformas para que la dificultad venga del salto, no de bugs de hitbox.
- Hecho: alargar niveles e incorporar checkpoints para sostener recorridos mas largos con musica.
- Ajustar dificultad por grupos de canciones: facil 1-5, medio 6-10, dificil 11-15.
- Agregar checkpoints visuales antes de zonas con enemigos o saltos opcionales.
- Mejorar el game feel con coyote time, salto variable y pequenas particulas al caer o tomar mate.

## Arte y presentacion

- Hecho: agregar pantalla de inicio pixelada y barra visual de progreso del nivel.
- Hecho: sumar banderas/checkpoints como elementos de presentacion y progreso.
- Hecho: hacer sprites por cuadro en una spritesheet pixel art logica en vez de dibujar a Milo como bloque unico.
- Hecho: crear animaciones separadas para idle, correr, saltar y recibir golpe.
- Hecho: mejorar los fondos con mas capas parallax y objetos identificables por cancion.
- Hecho: agregar pantalla de inicio global de **Super Milo J**.
- Hecho: mejorar la portada global con escena arcade animada y elementos del juego.
- Hecho: sacar numeros confusos de portada y orientar la escena a Milo J/album.
- Hecho: reemplazar la portada y los fondos base por PNG pixel art generados.
- Hecho: sumar familias visuales de fondo para barrio, ciudad nocturna/estudio y monte/rio/cancha.
- Pendiente: crear una escena propia para cada una de las 15 canciones, no solo familias visuales.
- Pendiente: crear tilesets de objetos por tema: barrio, estudio, lluvia, cancha, monte, rio y Obelisco.
- Pendiente: agregar seleccion de nivel, volumen y estado de audio dentro de la pantalla global.
- Pendiente: animaciones especiales para tomar mate y llegar al Obelisco.

## Audio

- Agregar control de volumen dentro del juego.
- Guardar si la musica esta prendida o apagada.
- Hacer fade-in/fade-out al cambiar de nivel.
- Permitir archivos `.mp3`, `.ogg` o `.wav` con deteccion automatica.

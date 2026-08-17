# Roadmap de la proxima version

## Etapa 1: prioridad alta

Estado: hecha.

- Hecho: separar el tutorial del album.
- Hecho: crear un nivel 00 de practica sin cancion, sin desbloqueos y sin progreso del album.
- Hecho: mantener los 15 niveles del album como campaña principal.
- Hecho: extender el QA a 16 escenarios: tutorial + 15 canciones.
- Hecho: validar tutorial, assets, rutas, checkpoints, mates, enemigos, plataformas, obstaculos y audios.
- Hecho: mantener build de Next.js limpio despues de los cambios.

## Etapa 2: jugabilidad

Prioridad siguiente.

- Ajustar el tutorial para que tenga carteles visuales simples dentro del escenario, no texto largo fuera del juego.
- Agregar coyote time: permitir saltar unas pocas frames despues de salir de una plataforma.
- Agregar jump buffer: si el jugador toca salto apenas antes de caer, que salte al aterrizar.
- Agregar salto variable: salto corto si se suelta rapido, salto alto si se mantiene.
- Revisar dificultad por bloques: niveles 1-5 accesibles, 6-10 con plataformas obligatorias, 11-15 exigentes.
- Colocar checkpoints antes de zonas dificiles, no despues.
- Hacer que los enemigos tengan roles mas claros: caminante, saltarin, flotante, carga, espera y emboscada.
- Evitar zonas largas sin decision: cada tramo deberia tener nota, enemigo, bloque, salto o atmosfera fuerte.
- Agregar pequenas recompensas opcionales para rutas elevadas: notas grandes, bloques secretos o atajos.

## Etapa 3: arte y presentacion

Estado: base hecha en alta calidad.

- Hecho: generar 16 fondos PNG distintos, uno para tutorial y uno por cancion.
- Hecho: reemplazar los fondos placeholder por PNGs pixel art de mayor detalle, comparables con `bg-barrio.png`, `bg-ciudad-noche.png` y `bg-monte-rio.png`.
- Hecho: usar nombres estables: `bg-00-tutorial.png`, `bg-01-bajo-de-la-piel.png`, hasta `bg-15-jangadero.png`.
- Hecho: crear `scripts/generate-pixel-assets.ps1` para regenerar los fondos y la spritesheet.
- Hecho: crear `public/art/milo-spritesheet.png` con Milo chico y Milo actual.
- Hecho: limpiar transparencia real del spritesheet para que el personaje no arrastre fondo.
- Hecho: separar hitbox y sprite: la fisica conserva rectangulos y el render usa spritesheet.
- Hecho: agregar frames para idle, correr, saltar, caer y recibir golpe.
- Hecho: diferenciar atmosferas de los ultimos niveles: niebla, luciernagas y olas.
- Pendiente: hacer una pasada manual de composicion por nivel para ajustar contraste entre fondo, plataformas, notas y enemigos.
- Pendiente: sumar frames especificos de tomar mate y celebrar.
- Pendiente: mejorar animacion del mate con vapor, brillo y rebote.
- Pendiente: mejorar Obelisco/meta con bandera argentina ondeando.

## Etapa 4: audio

Va al final para no mezclar bugs visuales con bugs de reproduccion.

- Agregar control de volumen dentro del juego.
- Guardar preferencia de musica activada/desactivada.
- Hacer fade-in y fade-out al cambiar de nivel.
- Mostrar estado de pista: cargando, reproduciendo, pausada o bloqueada por navegador.
- Evaluar loops suaves si una cancion termina antes de completar el nivel.

## Etapa 5: QA visual y jugable

- Mantener `npm run qa` como requisito minimo antes de cada subida.
- Agregar capturas automaticas por nivel para revisar fondos, plataformas y sprites.
- Agregar prueba de existencia para los 15 fondos cuando se generen.
- Agregar prueba de spritesheet: archivo existe, dimensiones esperadas y frames configurados.
- Agregar prueba de power-up: tomar mate, mantener look actual y perder solo el poder al recibir dano.
- Agregar prueba de contraste: fondos oscuros no deben esconder enemigos ni notas.

## Proxima accion recomendada

La siguiente tanda deberia ser una pasada mixta de **QA visual + jugabilidad fina**: capturas por nivel, contraste de fondos, coyote time, jump buffer, salto variable y tutorial con instrucciones visuales integradas al escenario.

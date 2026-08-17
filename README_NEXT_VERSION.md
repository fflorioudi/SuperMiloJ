# Ideas para la proxima version

## Objetivo general

La proxima version deberia convertir **Super Milo J** en una version mas autoral: 15 niveles con identidad visual propia, protagonista mas reconocible, animaciones mas fluidas y una experiencia mas cercana a un juego terminado que a un prototipo.

## Orden sugerido

1. Fondos 15/15 por cancion.
2. Protagonista nuevo con spritesheet real.
3. Animaciones y efectos de juego.
4. Ajuste fino de niveles y dificultad.
5. Audio y presentacion final.
6. QA visual y jugable.

## Fondos por cancion

- Generar 15 PNG distintos, uno por nivel, en pixel art horizontal 16:9.
- Mantener lectura clara del gameplay: el fondo no debe competir con plataformas, enemigos, notas ni mates.
- Separar cada fondo en capas: cielo/lejos, edificios o paisaje medio, objetos cercanos y atmosfera animada.
- Usar parallax suave por capa para que no se sienta como imagen estatica.
- Crear una paleta propia por tema, evitando que todos los niveles compartan los mismos colores.
- Agregar objetos reconocibles por cancion: patio, barrio, ciudad, estudio, lluvia, recuerdos, cocina, reloj, cancha, monte, luciernagas, rio y Obelisco.
- Preparar nombres de assets estables: `bg-01-bajo-de-la-piel.png`, `bg-02-nino.png`, etc.
- Agregar fallback si falta un PNG, para que el nivel nunca quede sin fondo.

## Protagonista

- Crear una spritesheet nueva de Milo chico: campera azul, remera blanca, corte de sus inicios, cara mas joven.
- Crear una spritesheet nueva de Milo actual: campera marron, gesto mas serio, diente dorado y detalle metalico.
- Pasar de sprites dibujados con rectangulos a sprites pixel art generados/retocados.
- Mantener hitbox separada del dibujo para que el personaje pueda verse mejor sin romper colisiones.
- Agregar frames para idle, caminar, correr, saltar, caer, recibir golpe, tomar mate y celebrar.
- Hacer que el cambio por mate sea visualmente especial: brillo corto, pose nueva y transicion chico -> actual.
- Mantener la regla actual: el look de Milo actual queda, pero el poder se pierde al recibir un golpe.

## Animaciones

- Mejorar caminata con 4 a 6 frames por direccion.
- Agregar squash/stretch sutil al aterrizar, sin deformar demasiado el pixel art.
- Agregar particulas chicas al caer, romper bloque, juntar nota y tomar mate.
- Animar notas musicales con oscilacion y brillo por color de nivel.
- Animar mates como power-up raro: vapor, brillo y pequeño rebote.
- Animar el Obelisco/meta con bandera argentina ondeando.
- Agregar una mini celebracion al completar cada cancion.

## Jugabilidad

- Revisar la dificultad por bloques: niveles 1-5 accesibles, 6-10 con rutas obligatorias por plataformas, 11-15 mas largos y exigentes.
- Ajustar checkpoints para que esten antes de secciones complicadas, no despues.
- Mantener niveles largos para disfrutar la musica, pero evitar tramos vacios.
- Agregar coyote time y salto variable para que el control se sienta mas justo.
- Crear patrones de enemigos por nivel: patrulla simple, salto, zigzag, carga, espera y emboscada.
- Evitar enemigos atrapados entre escalones o sobre plataformas demasiado chicas.
- Agregar bloques sorpresa con notas, mates raros y algun bonus visual.

## Audio

- Agregar control de volumen dentro del juego.
- Guardar preferencia de musica activada/desactivada.
- Hacer fade-in y fade-out al cambiar de nivel.
- Mostrar estado de pista: cargando, reproduciendo, pausada o bloqueada por navegador.
- Evaluar loops suaves si una cancion termina antes de completar el nivel.

## QA proxima

- Mantener las 750 simulaciones actuales como base minima.
- Agregar capturas automaticas por nivel para revisar fondos, plataformas y sprites.
- Agregar pruebas de respawn en cada checkpoint, no solo ruta completa.
- Agregar pruebas especificas de enemigo arriba/abajo de plataforma en varios niveles.
- Agregar pruebas de power-up: tomar mate, recibir golpe, mantener look y perder poder.
- Agregar una prueba de assets: verificar que existan los 15 fondos y la spritesheet del protagonista.
- Agregar una prueba de contraste: fondos oscuros no deben esconder enemigos ni notas.

## Decision para la proxima tanda

La mejor proxima mejora grande seria empezar por los **15 fondos PNG por cancion** y, en paralelo, preparar el formato de spritesheet nuevo para Milo. Eso permite subir mucho la calidad visual sin tocar de golpe toda la fisica del juego.

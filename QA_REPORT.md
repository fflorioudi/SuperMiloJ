# QA Report

Fecha: 2026-08-16

## Alcance

- Se simularon 16 escenarios: tutorial + 15 niveles del album.
- Cada nivel fue recorrido 50 veces.
- Total: 800 corridas automatizadas.
- Cada nivel se probo con 5 estilos de ruta: normal, conservador, rapido, salto tarde y salto temprano.
- Se validaron ruta base, suelo continuo, llegada al Obelisco, audios locales, bloques, notas y enemigos.
- El QA usa el nucleo compartido `src/game/core.js`, el mismo que importa la app.
- Se agregaron pruebas puntuales para resize de power-up, snap a plataforma, respawn, movimiento enemigo y colisiones rectangulares.
- Se valida que desde niveles medios existan obstaculos obligatorios que fuerzan rutas por plataformas.
- La simulacion automatica ahora salta ante plataformas y obstaculos.
- Se agregaron pruebas puntuales para rendijas entre muros/plataformas y enemigos chocando contra paredes.
- Se valida que cada nivel tenga checkpoints y que la ruta extendida siga siendo completable.
- Se valida que los muros no crucen plataformas elevadas ni queden pegados a bordes que formen escalones trampa.
- Se valida que las patrullas de enemigos no atraviesen muros de escenario.
- Se valida que Milo pueda pasar por debajo de plataformas one-way sin quedar aplastado ni atrapado.
- Se valida que una plataforma bloquee el dano de un enemigo ubicado arriba cuando Milo esta debajo.
- Se valida la version con portada y fondos PNG generados dentro de `public/art`.
- Se valida que existan los assets de portada, la spritesheet de Milo, los spritesheets de terreno/enemigos y los 16 fondos PNG.
- Se valida la tanda v19 con fondos PNG de alta definicion y spritesheet de Milo con transparencia real.
- Se valida rareza de mates, cantidad minima de notas, plataformas elevadas, enemigos, obstaculos y checkpoints.
- Se simulan patrullas largas de enemigos contra muros para detectar penetraciones o rebotes rotos.
- Se valida que el tutorial no tenga audio de album, sea corto, tenga un mate, un checkpoint, un enemigo y ruta completada.

## Resultado

- Corridas exitosas: 800/800.
- Escenarios con fallos detectados: 0/16.
- Niveles de album con fallos detectados: 0/15.
- Audios detectados: 15/15.
- Caidas durante la ruta base: 0.
- Entidades fuera de rango: 0.
- Core tests exitosos: 15/15.

## Observaciones

- Desde niveles medios, la ruta exige saltar y usar plataformas en zonas bloqueadas por muros.
- Las plataformas flotantes combinan ruta obligatoria, notas, bloques y mates segun el nivel.
- Las hitbox visuales y fisicas de Milo quedaron alineadas para evitar falsa sensacion de flotar o atravesar piso.
- Los enemigos rebotan contra muros solidos en vez de atravesarlos.
- Los niveles son mas largos e incorporan checkpoints para sostener mejor sesiones con musica.
- Los fondos y la presentacion avanzaron a una version mas visual, con portada global de **Super Milo J**.
- La portada y tres familias de fondos dejaron de depender de decorado rectangular y ahora usan PNG pixel art como base.
- Las plataformas elevadas funcionan como piso al caer desde arriba, no como techo al pasar por debajo.
- Los enemigos sobre plataformas ya no golpean a Milo a traves del piso.
- Los checkpoints ahora pueden apoyarse en plataformas elevadas y respawnear a Milo en esa altura.
- Se corrigio una formula de separacion que podia generar plataformas demasiado pegadas en niveles avanzados.
- Si el patron de bloques dejaba un nivel sin mate, el generador ahora garantiza un mate raro sin hacerlo abundante.
- El tutorial quedo separado del album y no altera desbloqueos ni puntajes.
- Cada escenario tiene fondo PNG propio y el render de Milo usa `public/art/milo-spritesheet.png`.
- Las atmosferas de los ultimos niveles ya no comparten todas luciernagas: niebla, luciernagas y olas se dibujan por separado.
- Los fondos v19 reemplazan los placeholders livianos por escenas pixel art detalladas, tomando como referencia visual los PNG buenos de barrio, ciudad noche y monte rio.
- El spritesheet v19 se recorta por 8 columnas x 2 filas segun sus dimensiones reales, con fondo transparente para evitar rectangulos alrededor del personaje.
- La v22 apaga overlays animados de fondo y renderiza plataformas, obstaculos y enemigos desde PNGs para que el arte acompañe mejor los paisajes.
- El script no reemplaza playtesting humano completo, pero ayuda a detectar regresiones fuertes de nivel, audio y fisicas basicas.

## Como repetir la prueba

```bash
npm run qa
```

## Proxima mejora de QA

- Agregar pruebas visuales con capturas por nivel.
- Agregar pruebas especificas de power-up: tomar mate, mantener apariencia de Milo actual y perder solo el poder al recibir dano.
- Agregar pruebas visuales con capturas para detectar fondos demasiado cargados o con bajo contraste.

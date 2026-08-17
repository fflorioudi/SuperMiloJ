# Super Milo J - Plan de dificultad

Este documento define como subir la dificultad sin caer en la solucion falsa de sumar mas enemigos o plataformas. El problema actual es claro: mientras el piso continuo permita caminar hasta el final, las plataformas elevadas son opcionales y el nivel se puede resolver en segundos.

## Diagnostico actual

- El camino principal sigue siendo demasiado plano.
- Las plataformas elevadas muchas veces son recompensa, no requisito.
- Los muros ayudan, pero si no bloquean de verdad la ruta baja, el jugador los esquiva caminando.
- Poner enemigos en plataformas no aumenta la dificultad si el jugador puede pasar por abajo.
- El mate tiene aura visual/rectangular que se percibe como hitbox y puede causar golpes o atascos injustos.
- El juego necesita dificultad por lectura, ritmo y decisiones, no por saturacion.

## Referencias usadas

- Nintendo / Mario: el diseno de niveles funciona porque introduce una idea, la desarrolla, la varia y cierra con una prueba clara. Referencia: https://www.capitalvideogames.com/el-diseno-de-niveles-en-4-pasos-de-super-mario-3d-world/
- Analisis de Super Mario 3D World: estructura de cuatro pasos, similar a introduccion, desarrollo, giro y conclusion. Referencia: https://pixeltears.wordpress.com/2018/01/14/dissecting-a-super-mario-3d-world-level/
- Iwata Asks / Nintendo: las restricciones y la colocacion de enemigos/terreno son parte central del diseno de Super Mario Bros. Referencia: https://www.nintendo.com/en-gb/Iwata-Asks/Super-Mario-Bros-25th-Anniversary/Vol-5-Original-Super-Mario-Developers/4-Designing-Levels-Together/4-Designing-Levels-Together-212908.html
- Sonic: los buenos niveles no son solo velocidad; tienen rutas altas, medias y bajas con costos distintos. Las rutas altas suelen ser mas rapidas y dificiles de mantener, mientras las bajas son mas lentas o peligrosas. Referencia: https://forums.sonicretro.org/index.php?threads%2Fsonic-level-design.28302%2F=
- Sonic / GameDeveloper: Mario pide mirar, entender y actuar; Sonic castiga mas la perdida de momentum que la muerte directa. Referencia: https://www.gamedeveloper.com/game-platforms/analysis-i-sonic-i-s-game-design-influence

## Principio central

La dificultad tiene que venir de una ruta obligatoria bien disenada:

1. El jugador ve el obstaculo antes de sufrirlo.
2. El jugador entiende que habilidad se pide.
3. La ruta baja no resuelve todo.
4. Hay checkpoints antes de una zona dificil, no despues.
5. El error castiga, pero no arruina la partida entera.
6. Las recompensas opcionales existen, pero la ruta principal tambien exige jugar.

## Regla nueva para niveles

Cada nivel debe tener al menos 3 tipos de tramos:

- Tramo de lectura: presenta una mecanica con poco castigo.
- Tramo obligatorio: obliga a usar plataformas, timing o enemigo como obstaculo real.
- Tramo de tension: combina dos mecanicas antes de un checkpoint o meta.

Para niveles avanzados:

- Debe haber al menos un tramo donde caminar derecho sea imposible.
- Debe haber al menos un tramo donde quedarse quieto tambien sea mala idea.
- Debe haber al menos una decision de ruta: camino seguro lento o camino dificil rapido.

## Cambios prioritarios

### 1. Cortar la caminata directa

Objetivo: que todos los niveles del album tengan una ruta baja incompleta.

Cambios:

- Reemplazar piso continuo por secciones de piso con huecos controlados.
- No hacer agujeros imposibles: cada hueco debe tener plataforma visible, pared escalable o ruta alternativa.
- Usar "bloques de barrio" o "zanjas" visuales integradas al fondo para que no parezcan errores.
- El piso puede seguir siendo visualmente continuo en decorado, pero la collision debe tener interrupciones reales.

QA necesario:

- Agregar simulacion "walk-only": mantener derecha sin saltar.
- La prueba debe fallar en todos los niveles del album excepto tutorial o nivel 1 si queremos onboarding.
- Medir tiempo minimo teorico caminando; si llega a la meta, el nivel esta mal.

### 2. Zonas obligatorias por plataforma

Objetivo: que las plataformas no sean rutas opcionales.

Cambios:

- Crear "gates" de plataforma: para avanzar hay que subir, cruzar y bajar.
- Ubicar paredes bajas o huecos despues de una plataforma para impedir pasar por abajo.
- Usar plataformas con longitudes y alturas testeadas, no generadas al azar sin control.
- Separar cada gate en 3 pasos: subida, amenaza, salida.

Ejemplo:

- Nivel temprano: subir a una plataforma, saltar un hueco corto, bajar.
- Nivel medio: subir, evitar enemigo con timing, bajar al checkpoint.
- Nivel final: subir, esperar carga de enemigo, saltar a plataforma chica, caer a zona segura.

### 3. Enemigos con rol, no solo presencia

Objetivo: que cada enemigo cambie la forma de jugar.

Roles propuestos:

- Cassette: patrulla basica para ensenar timing.
- TV: saltarin que obliga a esperar o pasar por debajo en ventana segura.
- Microfono: carga horizontal; castiga quedarse quieto.
- Fantasma: vuelo lento que bloquea rutas altas.
- Luciernaga: vuelo irregular que obliga a leer patron, no memorizar un metro perfecto.
- Barril: rueda rapido en tramos bajos; empuja al jugador a subir.

Regla:

- Un enemigo por plataforma no sirve si el jugador puede evitar la plataforma.
- Mejor usar menos enemigos, pero ubicados en cuello de botella real.

### 4. Castigo tipo Sonic: perder ritmo

Objetivo: agregar dificultad sin matar siempre al jugador.

Cambios:

- Crear rutas altas rapidas con notas y menos enemigos, pero dificiles de mantener.
- Si el jugador falla la ruta alta, cae a una ruta baja mas lenta y peligrosa.
- No permitir volver facilmente a la ruta alta en el mismo tramo.
- Medir puntaje/tiempo para incentivar repetir niveles.

Esto hace que perder no siempre sea morir, sino perder fluidez, notas o tiempo.

### 5. Checkpoints mejor ubicados

Objetivo: que el jugador quiera seguir intentando.

Reglas:

- Checkpoint antes de una secuencia dificil.
- Checkpoint despues de demostrar dominio, no en medio de un salto.
- No poner checkpoints decorativos sobre rutas opcionales si la ruta principal no los toca.
- Los niveles finales pueden tener 4 checkpoints, pero cada uno debe proteger una seccion clara.

### 6. Mate sin hitbox injusta

Objetivo: el mate debe sentirse especial, no peligroso por bugs.

Cambios:

- Eliminar cualquier aura rectangular del mate si afecta percepcion o collision.
- Separar visual y fisica: el sprite puede tener brillo, pero la hitbox debe ser una caja chica y clara.
- El mate debe colisionar con piso, plataformas, bloques y paredes.
- El mate no debe empujar a Milo ni encajarlo en muros.

QA necesario:

- Prueba de tomar mate cerca de pared.
- Prueba de tomar mate debajo de plataforma.
- Prueba de contacto con enemigo durante aura: solo la hitbox real de Milo debe contar.

## Estructura nueva por nivel

### Tutorial

- Sin castigo fuerte.
- Ensena salto, bloque, mate, checkpoint y enemigo.
- No debe durar mas de 45 segundos.

### Niveles 1-3

- Una interrupcion real del piso.
- Un gate obligatorio simple.
- Enemigos basicos con timing legible.
- Mate muy raro, usado como sorpresa.

### Niveles 4-7

- Dos gates obligatorios.
- Un tramo donde la ruta alta sea mas rapida y la baja mas lenta.
- Primer uso fuerte de enemigos que cargan o saltan.
- Checkpoint antes del segundo gate.

### Niveles 8-11

- Tres gates obligatorios.
- Plataformas mas cortas, pero no injustas.
- Enemigos voladores bloqueando rutas altas.
- Barriles o microfonos para castigar caminar recto.

### Niveles 12-15

- Cuatro gates obligatorios.
- Ruta alta con gran recompensa pero alto riesgo.
- Ruta baja posible, pero mas larga, con mas enemigos y menos notas.
- Final con secuencia de dominio antes del Obelisco.
- El ultimo nivel no puede terminarse en menos de 60-90 segundos en una partida normal.

## Sistemas nuevos recomendados

### A. Editor declarativo de tramos

En vez de generar todo con formulas generales, crear piezas:

- `introJump`
- `singleGate`
- `enemyTiming`
- `risingPlatforms`
- `lowRouteTrap`
- `highRouteReward`
- `checkpointBreather`
- `finalChallenge`

Cada nivel se arma combinando piezas, como una cancion con compases.

### B. QA anti-caminata

Agregar simulaciones:

- `walkOnly`: derecha sin saltar.
- `noPlatformRoute`: intenta avanzar por piso bajo.
- `checkpointReach`: verifica que checkpoints importantes sean tocados.
- `routeTime`: estima duracion minima.
- `mateWallSafety`: toma mate cerca de pared/plataforma.

Condiciones:

- `walkOnly` no debe terminar niveles 2-15.
- `walkOnly` puede avanzar al primer obstaculo, pero no pasar la primera puerta.
- Nivel final debe durar minimo 60 segundos en ruta automatizada normal.

### C. Dificultad por ritmo

Agregar parametros por tramo:

- `safeWindow`: frames donde pasar es seguro.
- `recoverySpace`: distancia despues de un reto.
- `enemyOffset`: desfase para que enemigos no actuen sincronizados.
- `routePenalty`: que pasa si fallas una ruta alta.

## Plan de implementacion

### Fase 1: arreglos urgentes

- Eliminar aura/hitbox visual del mate.
- Verificar que la hitbox de Milo no cambie por efectos visuales.
- Agregar QA anti-caminata.
- Medir cuanto tarda una simulacion normal por nivel.

### Fase 2: redisenar terreno

- Cortar piso en secciones reales.
- Crear huecos con arte integrado.
- Crear gates obligatorios como piezas reutilizables.
- Evitar generacion puramente aleatoria de plataformas.

### Fase 3: enemigos con rol

- Reubicar enemigos en cuellos de botella.
- Reducir cantidad si hace falta.
- Mejorar patrones por tipo.
- Agregar enemigos como presion de timing, no como decoracion.

### Fase 4: rutas estilo Sonic

- Ruta alta: dificil, rapida y con mas notas.
- Ruta media: camino normal.
- Ruta baja: mas lenta, mas peligrosa, pero viable.
- Fallar la ruta alta no mata siempre; te baja a una ruta peor.

### Fase 5: balance fino

- Playtest manual de cada nivel.
- QA automatico despues de cada ajuste.
- Revisar tiempos: nivel temprano 45-70 s, medio 70-100 s, final 90-130 s.
- Ajustar checkpoints para que el jugador diga "una mas" y no "esto es injusto".

## Definicion de terminado

La dificultad esta bien cuando:

- No se puede completar el album caminando derecho.
- El ultimo nivel no dura 15 segundos.
- Cada nivel tiene al menos una mecanica memorable.
- El jugador entiende por que murio.
- Los checkpoints invitan a reintentar.
- El mate se siente como premio, no como bug.
- El QA pasa y el playtest humano confirma que hay tension sin frustracion.


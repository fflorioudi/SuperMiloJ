# Milo J Pixel Run

Juego local en Next.js inspirado en el album **La Vida Era Mas Corta** de Milo J.

## Como correrlo

```bash
npm install
npm run dev
```

Despues abri `http://localhost:3000`.

## Controles

- Mover: `A/D` o flechas izquierda/derecha.
- Saltar: `W`, flecha arriba o `Espacio`.
- En pantallas tactiles aparecen botones para izquierda, derecha y salto.
- La pantalla inicial incluye un **Tutorial** aparte del album, sin cancion ni progreso guardado.

## Musica local

El juego puede reproducir musica por nivel, pero los audios no estan incluidos por copyright.
Para activarlo, coloca tus archivos en `public/audio` con estos nombres:

- `01-bajo-de-la-piel.mp3`
- `02-nino.mp3`
- `03-gil.mp3`
- `04-ama-de-mi-sol.mp3`
- `05-solifican12.mp3`
- `06-lucia.mp3`
- `07-mmmm.mp3`
- `08-llora-llora.mp3`
- `09-recorde.mp3`
- `10-cuando-el-agua-hirviendo.mp3`
- `11-la-vida-era-mas-corta.mp3`
- `12-radamel.mp3`
- `13-el-invisible.mp3`
- `14-luciernagas.mp3`
- `15-jangadero.mp3`

Si Windows te oculto extensiones y los archivos quedaron como `02-nino.mp3.mp3`, el juego tambien los acepta.

## Versiones

### v1

- Se creo la app en Next.js.
- Se armo un juego de plataformas estilo Mario Bros en canvas.
- Se agregaron 15 niveles, uno por cada cancion de **La Vida Era Mas Corta**.
- Se agrego seleccion de niveles, progreso guardado en el navegador, vidas y puntaje.
- Las notas musicales funcionan como coleccionables.
- Milo es el protagonista jugable con estetica pixel.
- Se agregaron enemigos basicos, plataformas y meta de microfono.

### v2

- Se bajo la velocidad general para que el juego se sienta menos acelerado.
- Se ajusto la gravedad, aceleracion, salto y velocidad maxima.
- Se agregaron bloques tipo `?` que se activan al cabecearlos desde abajo.
- Se agregaron mates como power-up.
- El mate da una vida extra, suma puntos y activa un escudo temporal.
- Con el escudo del mate, Milo puede eliminar enemigos por contacto.
- Se mejoraron los sprites pixelados de Milo, enemigos, plataformas, notas, bloques y meta.
- Los enemigos ahora tienen mas detalles visuales y variantes.
- Se mejoro la presentacion visual del marco del juego y los botones.

### v3

- Se rediseño al protagonista en dos estados: Milo chiquito de sus inicios y Milo actual al tomar mate.
- El mate paso a ser un power-up escaso y especial: aparece en muy pocos bloques por nivel.
- Los bloques que no tienen mate ahora entregan notas escondidas o quedan vacios, para que el mate no sea garantizado.
- La transformacion por mate agranda a Milo, lo hace mas fuerte y lo protege por tiempo limitado.
- Se cambio la meta por un Obelisco pixelado con bandera argentina.
- Se agrego progresion de dificultad por nivel: mas distancia, plataformas mas chicas, mas altura y saltos mas exigentes.
- Se agregaron patrones de enemigos: caminantes, saltarines, flotantes y enemigos de carga.
- Los enemigos escalan velocidad y rango segun avanza el album.
- Cada cancion tiene un fondo propio inspirado en su clima: patio, ciudad, sol, ruta, noche folklorica, estudio, lluvia, recuerdos, cocina hirviendo, reloj, cancha, monte, luciernagas y rio.

### v4

- Se corrigio la dificultad inicial: los primeros niveles vuelven a tener suelo continuo y las plataformas flotantes pasan a ser apoyo/ruta extra.
- La dificultad ahora sube de forma mas gradual, con huecos recien en niveles posteriores.
- Se corrigio el bug de caida infinita: al caer al vacio Milo reaparece en la plataforma segura anterior.
- Se agrego estado y cartel de `GAME OVER` cuando se terminan las vidas.
- Se ajusto el sprite de Milo chiquito usando la referencia de campera azul, remera blanca, corte de sus inicios y cara mas joven.
- Se ajusto el sprite de Milo actual usando la referencia de campera marron, corte corto, gesto serio, cierre y diente dorado.

### v5

- Se eliminaron los saltos obligatorios sobre vacio: todos los niveles tienen suelo base continuo.
- Las plataformas flotantes quedan como rutas de puntos, mates y desafio opcional.
- Se separo la apariencia del power-up: al tomar mate, Milo queda con look actual aunque el poder temporal termine.
- Si Milo recibe un golpe, pierde la transformacion y vuelve a Milo chico.
- Se redibujo el protagonista con postura mas lateral/2D y animacion simple de pasos.
- Se agrego soporte para musica local por nivel desde `public/audio`.
- Se agrego boton de musica en el HUD.

### v6

- Se corrigio la reproduccion de audio para aceptar archivos `.mp3` y tambien `.mp3.mp3`.
- Se volvio el protagonista a una silueta mas parecida a la version anterior, menos lateral y menos rara visualmente.

### v7

- Se corrigio un bug al tomar mate sobre el piso: la transformacion ahora conserva la posicion de los pies.
- Milo se reajusta a la plataforma cercana despues de cambiar de tamano, evitando caidas raras por el hitbox.

### v8

- Se separo el nucleo del juego en `src/game/core.js` para compartir mundo, fisica base, player, enemigos, audio y progreso.
- La app y el QA ahora usan la misma logica base, evitando pruebas duplicadas contra una copia vieja.
- Se agrego modo debug con hitboxes, posicion del jugador, entidades y estado del power-up.
- Se guarda progreso ampliado: niveles desbloqueados, mejores puntajes, notas recolectadas y musica activada.
- Se reforzo `npm run qa` con pruebas de colision, respawn, power-up, enemigos y 150 corridas de ruta.

### v9

- Se retiro el boton Debug del HUD principal para que no aparezca como opcion tecnica para el jugador.
- El modo debug queda oculto para QA con `Shift + H`.
- Desde niveles medios aparecen muros de escenario que obligan a subir por plataformas.
- La ruta base ya no es solo caminar en niveles mas avanzados, pero se mantiene testeada para evitar saltos imposibles.
- El QA ahora simula saltos ante plataformas y obstaculos obligatorios.
- Milo se reajusta a la plataforma cercana despues de cambiar de tamaño, evitando caidas raras por el hitbox.
### v10

- Se reforzaron las hitbox de plataformas: Milo necesita apoyo real bajo los pies y ya no puede sostenerse con un borde minimo.
- Se reforzaron los muros obligatorios para que lleguen al suelo y se solapen con la ruta de plataformas, cerrando rendijas raras.
- La colision contra muros ahora usa la posicion anterior del jugador, evitando empujes incorrectos al saltar o caer cerca de una pared.
- Los enemigos ahora chocan con muros solidos y cambian de direccion en vez de traspasarlos.
- El QA suma pruebas especificas para rendijas de muros y enemigos contra paredes.

### v11

- Se alineo la hitbox de Milo con el sprite visible para evitar que parezca flotando o hundido en plataformas.
- La fisica ahora resuelve movimiento horizontal y vertical por separado: los muros bloquean laterales y las plataformas sostienen/techo sin enganchar a Milo.
- Los niveles son mas largos para que haya mas recorrido y se pueda disfrutar mejor cada cancion.
- Se agregaron checkpoints con bandera argentina repartidos por nivel.
- Al caer despues de activar un checkpoint, Milo reaparece desde ese punto en vez de volver al inicio o a una plataforma rara.
- Se agrego pantalla de inicio pixelada, barra de avance del nivel y una presentacion mas cuidada del HUD.

### v12

- El juego paso a llamarse **Super Milo J** en la portada y en el HUD.
- Se agrego una pantalla de inicio global antes de entrar a los niveles.
- Milo ahora se dibuja desde una spritesheet pixel art organizada por frames: idle, correr, saltar y recibir golpe.
- Se agregaron animaciones separadas para Milo chico y Milo actual.
- Los fondos tienen mas capas parallax y objetos identificables por cancion.
- Los muros de escenario ya no se generan cruzando plataformas ni pegados a bordes que formen escalones trampa.
- Las patrullas de enemigos se recortan automaticamente si un muro podria dejarlos atrapados.
- El QA valida que no haya plataformas atravesando muros ni enemigos patrullando contra obstaculos.

### v13

- Se corrigio el bug de invisibilidad al caminar hacia atras: el espejado del sprite ya no duplica la coordenada vertical.
- Las plataformas elevadas ahora son one-way reales: Milo aterriza desde arriba, pero puede pasar por debajo sin agacharse ni quedar atrapado.
- Los muros conservan colision solida completa, separados de las plataformas.
- Se mejoro la pantalla global de **Super Milo J** con escena arcade, cielo animado, ciudad, Obelisco, mate, notas y botones mas presentes.
- El QA suma una prueba especifica para pasar por debajo de plataformas sin bug visual.

### v14

- Se saco la fila confusa de numeros `01-05` de la portada global.
- La portada ahora apunta mas a Milo J y al album: Obelisco, mate, disco, campera marron y detalle tipo cicatriz metalica.
- Se ajusto la descripcion de portada para contar mejor la idea del viaje de Milo chico al Milo actual.
- Se corrigio el dano injusto de enemigos sobre plataformas: si una plataforma separa a Milo del enemigo, no hay golpe por tocar el gorro desde abajo.
- Los fondos reducen bloques gigantes y agregan siluetas pixeladas mas suaves, ventanas y textura de escena.
- El QA suma una prueba especifica para enemigo arriba de plataforma y Milo debajo.

### v15

- Se reemplazo la escena cuadrada de portada por un PNG generado para **Super Milo J**, con Buenos Aires, Obelisco, mate, vinilo, campera marron y bandera argentina.
- Se agregaron fondos PNG generados para tres familias visuales: barrio/patio, ciudad nocturna/estudio y monte/rio/cancha.
- El canvas ahora usa esos fondos como base ilustrada y encima suma atmosfera animada por nivel: lluvia, polvo, luces, luciernagas y detalles musicales.
- Se redujo la dependencia de rectangulos gigantes en fondos y portada para que el juego se sienta mas como pixel art armado con intencion.
- Se mantuvo el parche de hitbox para que un enemigo sobre plataforma no golpee a Milo desde abajo.

### v16

- El QA automatico paso de 150 a 750 corridas: 50 por nivel con cinco estilos de ruta distintos.
- El QA ahora valida assets PNG, rareza de mates, cantidad de notas, plataformas elevadas, checkpoints, enemigos, obstaculos y patrullas largas contra muros.
- Se corrigio la generacion de plataformas para evitar grupos demasiado pegados en niveles avanzados.
- Se garantiza que cada nivel tenga mate raro aunque el patron de bloques deje afuera el indice original.
- Los checkpoints pueden apoyarse sobre plataformas elevadas y respawnear a Milo en esa misma altura.
- Se reescribio `README_NEXT_VERSION.md` como roadmap para fondos 15/15, spritesheet nueva de Milo, animaciones y QA visual.

### v17

- Se agrego un **Tutorial** como nivel 00 separado del album.
- El tutorial no usa cancion, no desbloquea niveles y no modifica el progreso del album.
- El tutorial ensena movimiento, salto a plataformas, bloque con nota, mate raro, checkpoint, pared obligatoria y enemigo de practica.
- La portada global ahora permite entrar directo al album o practicar primero en el tutorial.
- La playlist muestra el tutorial separado antes de los 15 niveles del album.
- El QA automatico ahora valida 16 escenarios: tutorial + 15 canciones, con 800 corridas totales.

### v18

- Se generaron 16 fondos PNG pixel art: tutorial + 15 canciones.
- Cada nivel ahora usa su propio asset `bg-XX-*.png` en vez de compartir tres familias de fondo.
- Se agrego `scripts/generate-pixel-assets.ps1` para regenerar fondos y spritesheet localmente.
- Se agrego `public/art/milo-spritesheet.png` con Milo chico y Milo actual en frames separados.
- El render de Milo ahora usa spritesheet externa y conserva fallback al dibujo anterior si el PNG no carga.
- Las animaciones de fondo dejaron de repetirse en los ultimos tres niveles: `El Invisible` usa niebla, `Luciernagas` usa luciernagas y `Jangadero` usa olas de rio.
- `Llora Llora` tiene fondo y lluvia redibujados para evitar la sensacion de bloques cuadrados.
- El QA valida que existan los 16 fondos y la spritesheet.

### v19

- Se reemplazaron los 16 fondos placeholder por PNGs pixel art de alta definicion, generados tomando como referencia la calidad de `bg-barrio.png`, `bg-ciudad-noche.png` y `bg-monte-rio.png`.
- Cada cancion tiene una escena mas identificable: cancha para `Radamel`, cocina/terraza para `Cuando El Agua Hirviendo`, relojes para `La Vida Era Mas Corta`, rio final para `Jangadero`, bosque calido para `Luciernagas` y monte con niebla para `El Invisible`.
- `Llora Llora` recibio una escena de lluvia neon mas organica para abandonar el fondo cuadrado anterior.
- Se rehizo `milo-spritesheet.png` con Milo chico de campera azul y Milo actual de campera marron, usando dos filas de animacion.
- Se limpio la transparencia real del spritesheet para que Milo no arrastre un rectangulo de fondo.
- El renderer ahora recorta el spritesheet segun sus dimensiones reales en 8 columnas x 2 filas, asi los assets de mayor calidad no quedan deformados.

### v20

- Se corrigio el anclaje del spritesheet de Milo: ahora cada frame se recorta por el cuerpo visible y los pies apoyan sobre la hitbox.
- Se bajo un poco la aceleracion y la velocidad maxima para que la animacion de caminar/correr se pueda apreciar mejor.
- Se ralentizo levemente el ciclo de frames al caminar para que el movimiento no se sienta tan acelerado visualmente.

### v21

- Se separo la animacion de dano de la invencibilidad del mate: tomar mate ya no muestra a Milo como herido.
- Se agrego una pose visual de mate/celebracion usando el frame final del spritesheet.
- Se corrigio el cierre del nivel para que Milo se quede quieto en pose de victoria al llegar al Obelisco.
- Se actualizo la etiqueta interna a `Super Milo J v21`.

### v22

- Se apagaron las animaciones de fondo dibujadas por canvas para dejar respirar los paisajes PNG.
- Se agrego `public/art/terrain-spritesheet.png` con plataformas, suelos y obstaculos pixel art de mayor produccion.
- Se agrego `public/art/enemy-spritesheet.png` con enemigos mas detallados y siluetas distintas.
- Plataformas, paredes y enemigos ahora se renderizan desde PNGs, manteniendo las hitbox rectangulares para no romper la jugabilidad.
- El QA valida que existan los nuevos spritesheets de terreno y enemigos.

### v23

- Se corrigio el error visual de v22: el piso vuelve a ser solido, estatico y continuo, sin sprites de plataformas ni agujeros visuales.
- Se agrego `public/art/platform-spritesheet.png` solo para plataformas elevadas, con superficies planas y mas legibles.
- Se agrego `public/art/enemy-animated-spritesheet.png` con 6 enemigos y 4 frames por tipo.
- Los enemigos ahora tienen tipos y patrones propios: cassette caminante, TV saltarin, fantasma volador, microfono rapido, luciernaga con vuelo organico y barril rodante.
- El generador de enemigos varia velocidad, fase, amplitud y periodo para que no todos revelen el mismo patron al mismo tiempo.
- Los enemigos voladores ya no usan el mismo rebote contra paredes que los enemigos terrestres.

### v24

- El muro/obstaculo dejo de cambiar visualmente con la camara: ahora el sprite se decide con la posicion real del mundo y queda estatico.
- Se reemplazo el spritesheet combinado por un spritesheet separado para cada enemigo en `public/art/enemies`.
- Cada enemigo tiene frames propios: cassette caminante, TV saltarin, fantasma volador, microfono de carga, luciernaga y barril rodante.
- Los spritesheets nuevos se recortan por alfa para que no arrastren margen transparente gigante ni queden chicos en pantalla.
- Se achicaron y ajustaron las hitbox fisicas por tipo de enemigo para que el dano encaje mejor con el PNG visible.
- El render de enemigos centra el dibujo sobre la hitbox y usa sombras mas chicas, evitando golpes injustos por bordes transparentes o adornos.
- Se agrego `public/art/note-spritesheet.png` para notas musicales mas pulidas y con variantes de color.
- Se agrego `public/art/ground-spritesheet.png` para mejorar el piso sin romper la regla de suelo solido continuo.
- El QA valida que existan todos los sprites separados, el nuevo piso, las nuevas notas y que 800 corridas sigan completando tutorial + album.

### v25

- Se subio la dificultad real de los niveles: todos los niveles del album tienen al menos una puerta de muro que corta la caminata simple.
- La curva ahora usa 1 puerta en niveles tempranos y 2 puertas en niveles medios/finales, con plataformas auxiliares para que sea desafiante pero terminable.
- Se corrigio la generacion de muros para que no se encimen con plataformas elevadas ni dejen rutas rotas.
- Se agregaron PNGs nuevos para bloque, mate, checkpoint y Obelisco final: `block-spritesheet.png`, `mate-powerup.png`, `checkpoint-flag.png` y `obelisco-goal.png`.
- El bloque de nota/mate, el mate raro, los checkpoints y la meta ahora se renderizan desde PNGs con fallback al dibujo anterior.
- Se reemplazo el cartel frio de victoria por un panel final mas acorde: cierre de cancion, mensaje de album y llamada a seguir.
- El QA sigue validando 800 corridas y ahora controla que cada nivel del album tenga obstaculos obligatorios sin romper la ruta.

### v26

- Se quitaron las auras/cuadrados transparentes que aparecian alrededor del mate, bloques, checkpoints y Obelisco.
- Los PNGs principales ahora respiran mas limpios sobre el escenario, con sombras discretas en vez de cajas de ayuda visual.
- Se mejoro el mensaje final para que sea mas amigable y contextual: tutorial, cancion superada y album completo tienen textos distintos.
- Se corrigio la fisica del mate raro: ahora choca con muros y bloques solidos, rebota o cae sobre ellos en vez de atravesarlos.
- El QA agrego pruebas especificas para el mate contra paredes y bloques, manteniendo las 800 corridas generales.

### v27

- Se eliminaron los dos pixels decorativos del checkpoint activo y el aura rectangular de Milo al cerrar un nivel.
- Se rehizo el panel de cierre desde cero: mas grande, mas claro y con textos que empujan a seguir jugando o mejorar la pasada.
- Se subio la dificultad desde diseno de nivel, no por cantidad bruta: mas puertas obligatorias, rutas por plataformas y mini secuencias alrededor de cada muro.
- La curva de puertas ahora crece con el album: 1 puerta en niveles iniciales, 2 en tempranos/medios, 3 desde la mitad y 4 en los tramos finales.
- Los enemigos de puertas tienen patrones mas variados: cargas con pausa, saltos con espera, vuelos con oscilacion extra, barriles con ritmo irregular y fases desincronizadas.
- Se agregaron guardianes de ruta en zonas obligatorias para que pasar por abajo deje de ser la respuesta facil.
- Se ajusto la generacion final para evitar que enemigos o plataformas nazcan pegados a muros.
- El QA volvio a pasar 800 corridas con 0 niveles fallando despues de subir la dificultad.

### v28

- Se completo el plan de `README_DIFICULTAD.md`: el album ya no se puede resolver caminando derecho.
- El piso del album dejo de ser continuo y ahora se divide en segmentos con pits obligatorios.
- Cada pit se acompana con plataformas de entrada/salida para que la dificultad sea real pero terminable.
- La curva de pits escala por nivel: 1 en niveles iniciales, 2-3 en medios y 4 en finales.
- Se alargaron los niveles base para que las canciones tengan mas recorrido y el ultimo nivel no dure segundos.
- El QA agrego `walk-only`: ningun nivel del album puede completarse manteniendo derecha sin saltar.
- Se elimino el aura visual de Milo al tomar mate para que no parezca ni actue como hitbox.
- Al tomar mate cerca de paredes o bloques, Milo se separa del solido para evitar atascos.
- Los enemigos voladores ahora tambien reaccionan ante muros y no los atraviesan en patrullas largas.
- `npm run qa` paso con 800/800 corridas, 0 niveles fallando y todos los niveles del album bloqueando la ruta caminada.

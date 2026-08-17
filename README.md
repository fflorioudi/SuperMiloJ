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

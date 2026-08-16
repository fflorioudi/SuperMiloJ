# QA Report

Fecha: 2026-08-16

## Alcance

- Se simularon 15 niveles.
- Cada nivel fue recorrido 10 veces.
- Total: 150 corridas automatizadas.
- Se validaron ruta base, suelo continuo, llegada al Obelisco, audios locales, bloques, notas y enemigos.
- El QA usa el nucleo compartido `src/game/core.js`, el mismo que importa la app.
- Se agregaron pruebas puntuales para resize de power-up, snap a plataforma, respawn, movimiento enemigo y colisiones rectangulares.
- Se valida que desde niveles medios existan obstaculos obligatorios que fuerzan rutas por plataformas.
- La simulacion automatica ahora salta ante plataformas y obstaculos.
- Se agregaron pruebas puntuales para rendijas entre muros/plataformas y enemigos chocando contra paredes.
- Se valida que cada nivel tenga checkpoints y que la ruta extendida siga siendo completable.
- Se valida que los muros no crucen plataformas elevadas ni queden pegados a bordes que formen escalones trampa.
- Se valida que las patrullas de enemigos no atraviesen muros de escenario.

## Resultado

- Corridas exitosas: 150/150.
- Niveles con fallos detectados: 0/15.
- Audios detectados: 15/15.
- Caidas durante la ruta base: 0.
- Entidades fuera de rango: 0.
- Core tests exitosos: 9/9.

## Observaciones

- Desde niveles medios, la ruta exige saltar y usar plataformas en zonas bloqueadas por muros.
- Las plataformas flotantes combinan ruta obligatoria, notas, bloques y mates segun el nivel.
- Las hitbox visuales y fisicas de Milo quedaron alineadas para evitar falsa sensacion de flotar o atravesar piso.
- Los enemigos rebotan contra muros solidos en vez de atravesarlos.
- Los niveles son mas largos e incorporan checkpoints para sostener mejor sesiones con musica.
- Los fondos y la presentacion avanzaron a una version mas visual, con portada global de **Super Milo J**.
- El script no reemplaza playtesting humano completo, pero ayuda a detectar regresiones fuertes de nivel, audio y fisicas basicas.

## Como repetir la prueba

```bash
npm run qa
```

## Proxima mejora de QA

- Separar mas logica del loop principal para testear game over, recoleccion de notas y fin de nivel sin depender del canvas.
- Agregar pruebas visuales con capturas por nivel.

# QA Report

Fecha: 2026-08-16

## Alcance

- Se simularon 15 niveles.
- Cada nivel fue recorrido 10 veces.
- Total: 150 corridas automatizadas.
- Se validaron ruta base, suelo continuo, llegada al Obelisco, audios locales, bloques, notas y enemigos.
- El QA usa el nucleo compartido `src/game/core.js`, el mismo que importa la app.
- Se agregaron pruebas puntuales para resize de power-up, snap a plataforma, respawn, movimiento enemigo y colisiones rectangulares.

## Resultado

- Corridas exitosas: 150/150.
- Niveles con fallos detectados: 0/15.
- Audios detectados: 15/15.
- Caidas durante la ruta base: 0.
- Entidades fuera de rango: 0.
- Core tests exitosos: 6/6.

## Observaciones

- La ruta base de cada nivel es completable caminando hacia la meta.
- Las plataformas flotantes quedan como rutas opcionales para notas, bloques y mates.
- El script no reemplaza playtesting humano completo, pero ayuda a detectar regresiones fuertes de nivel, audio y fisicas basicas.

## Como repetir la prueba

```bash
npm run qa
```

## Proxima mejora de QA

- Separar mas logica del loop principal para testear game over, recoleccion de notas y fin de nivel sin depender del canvas.
- Agregar pruebas visuales con capturas por nivel.

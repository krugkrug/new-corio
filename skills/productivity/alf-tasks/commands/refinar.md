---
description: Desarrolla los requerimientos de una idea ya decidida (criterios INVEST) hasta que tenga criterio de éxito verificable — paso previo a /backlog.
---

# Refinar — de idea decidida a tarea ejecutable

Aplica **INVEST** (Wake — estándar en Agile/XP para historias de usuario):
Independiente, Negociable, Valiosa, Estimable, Pequeña (pasos secuenciales
distintos → tareas separadas), Testable (criterio de éxito verificable sin
nadie delante). Mismo criterio que ya exige `taskrun.md` Paso 4 y
`protocolo-cola.md` Paso 0.5 — aquí se hace antes, en conversación, para que
la tarea nazca ya lista en vez de bloquearse después por descripción
insuficiente.

Si no viene de `/convergencia` y la solución no está decidida todavía (hay
más de una forma razonable de resolverlo), para y sugiere `/divergencia`
primero — ver `../skills/tasks/references/niveles-y-triaje.md`.

## Pasos

1. Repite en una frase la solución ya decidida (de `/convergencia`, o la que
   traiga Alfredo directa) — confirma que sigue en pie antes de invertir en
   detallarla.
2. Para cada criterio INVEST, o lo cubre o lo pregunta — no lo inventes:
   - **Testable**: ¿cómo se comprueba que está hecho, sin releer esta
     conversación? Si no hay respuesta clara, es la pregunta que más importa
     hacer aquí.
   - **Pequeña**: ¿son varios pasos con criterio de éxito propio cada uno?
     Si sí, se convierte en varias tareas encadenadas con `dependeDe` (mismo
     patrón que Paso 0.5.3 de `protocolo-cola.md`), no una sola ambigua.
   - **Valiosa**: ¿a qué objetivo sirve? (enlaza con el de `/divergencia` si
     viene de ahí).
   - **Estimable**: suficiente para elegir `modelo` (haiku/sonnet/opus,
     mismo criterio que `orquesta.md` Paso 6).
   - Independiente/Negociable: rara vez hacen falta preguntas aquí — anota
     si detectas acoplamiento fuerte con otra tarea viva.
3. Si sale más de una tarea (Pequeña falló), enséñalas todas —fase,
   criterio de éxito, modelo, dependencia— **antes de escribir nada**, igual
   que el troceo de `protocolo-cola.md` Paso 0.5: descomponer es una
   decisión de alcance, no se escribe sin que la veas.
4. Asigna `semaforo` con el criterio del semáforo de `CLAUDE.md`: `verde`
   solo si es reversible y barata — si no, `amarillo`/`rojo` con la
   pregunta concreta ya redactada (nunca autoaprobado).
5. Cierra con el bloque listo para `/backlog`: título, descripción con
   criterio de éxito, repo, modelo sugerido, semáforo, dependencias.

## Guardarraíles

- No inventes criterio de éxito ni alcance donde Alfredo no lo ha dicho —
  pregunta; una tarea mal refinada solo traslada el problema a quien la
  ejecute después.
- Si detectas que en realidad hay más de una forma razonable de resolverlo
  (no debería pasar si vino de `/convergencia`, pero puede si entraste
  directo), dilo y para — eso es nivel 3, no nivel 2.
- No decidas tú el troceo en fases sin enseñarlo antes (paso 3).

## Uso

`/refinar <idea ya decidida>` — o sin argumento si sigue de `/convergencia`
en la misma conversación.

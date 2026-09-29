---
description: Da de alta en claudedash una o varias tareas ya refinadas — escribe con tarea.py, estado siempre "backlog". Último paso antes de que /orquesta o Alfredo las promuevan a pendiente.
---

# Backlog — anotar en claudedash

Escribe con `panel-tareas/tarea.py` (nunca a mano contra `/api/claudedash` —
ver skill `tasks` §2 y `protocolo-cola.md`), igual que hace `boceto.md` al
cerrar. `estado` siempre `"backlog"`, **nunca `"pendiente"`**: una tarea
nueva no se lanza sola — la promueve Alfredo a mano desde el panel, o el
Paso 0.5 de `protocolo-cola.md` en la siguiente pasada de `/tasks lanza` /
`/taskrun` / `/orquesta`.

Necesita `CLAUDEDASH_PASSWORD` en el entorno (skill `tasks` §2) — si falta,
dilo explícito en vez de intentarlo a ciegas.

## Pasos

1. Si lo que traes no tiene criterio de éxito claro (viniste directo, sin
   pasar por `/refinar`), para y sugiere `/refinar` primero — ver
   `../skills/tasks/references/niveles-y-triaje.md`. Excepción: nivel 1,
   idea ya obvia y autocontenida ("apunta que hay que revisar el contrato
   de X antes de firmar") — ahí escribe directo, sin forzar un `/refinar`
   que no aporta nada.
2. Por cada tarea (puede ser más de una si `/refinar` troceó en fases):

   ```bash
   python3 panel-tareas/tarea.py nueva --json '{
     "titulo": "<una frase>",
     "descripcion": "<criterio de éxito + alcance dentro/fuera + cualquier decisión ya tomada — lo que sustituye a esta conversación para quien la ejecute>",
     "repo": "krugkrug/<repo>",
     "prio": "media",
     "semaforo": "<verde/amarillo/rojo, de /refinar o decidido aquí>",
     "estado": "backlog",
     "modelo": null,
     "dependeDe": "<id de la fase anterior, o null>",
     "necesitaRespuesta": false,
     "sesion": null,
     "notas": []
   }'
   ```

   `modelo` va `null` aquí aunque `/refinar` haya sugerido uno — se apunta
   en la nota inicial (`--nota` al crear, o un `patch` justo después) para
   que quien promueva la tarea lo tenga a mano, sin que este comando se
   salte el Paso 0.5 de `protocolo-cola.md`, que es quien decide el
   `modelo` real al promover.
3. Si vienen varias tareas encadenadas, créalas en orden y usa el `id` que
   devuelva cada `tarea.py nueva` como `dependeDe` de la siguiente.
4. Confirma con id/título de cada tarea nueva y, si `prio` no la dijo
   Alfredo, que quedó en `media` por defecto (ajustable sin coste luego, no
   preguntes solo por esto).

## Anti-patrones

- Crear con `estado` distinto de `"backlog"` — eso es decisión de Alfredo o
  del Paso 0.5, no de este comando.
- Escribir a mano contra el backend en vez de `tarea.py` — mismo riesgo de
  pisar escrituras concurrentes que documenta `protocolo-cola.md`.
- Saltarse `/refinar` en una idea que de verdad lo necesitaba (nivel 2/3)
  solo por ir rápido — la tarea nace bloqueable en el primer Paso 0.5 que la
  toque, y eso cuesta más que refinarla ahora.

## Uso

`/backlog <lo que refinó /refinar>` — o sin argumento si sigue en la misma
conversación.

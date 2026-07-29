---
description: Abre el panel de tareas y resume la cola (pendientes, bloqueadas, fantasmas)
---

Carga la skill `tasks` y ejecútala.

1. Abre el panel (Artifact de claude.ai) en el navegador integrado.
2. `git pull` y lee `panel-tareas/tareas.json` del repo `krugkrug/meta`. Resume:
   pendientes por prioridad, bloqueadas esperando respuesta, y en-curso —
   marcando las que no tienen `sesion` (fantasmas).
3. El resumen va en la misma respuesta; no te quedes en "panel abierto".

Según `$ARGUMENTS`:

- vacío → abrir + resumen, sin tocar nada.
- `lanza` / `ejecuta` → además, ejecuta las `pendiente` + `semaforo:verde` sin
  dependencia viva, siguiendo `references/protocolo-cola.md`. Amarillas y rojas
  se preguntan, no se ejecutan.
- `nueva <título>` → añade la tarea a tareas.json preguntando antes prioridad,
  semáforo, modelo y dependencia.
- `republica` / `publica` → republica `panel-tareas/index.html` sobre el Artifact
  existente (misma URL) subiendo `PANEL_VERSION`, sin tocar la cola.
- `taskrun` → como `lanza`, pero un agente por repositorio en paralelo en vez de
  tarea a tarea en esta sesión. Ver `taskrun.md`.
- un `owner/repo` → limita todo lo anterior a las tareas de ese repo.
- un número → abre esa tarea: descripción, notas completas, estado y qué falta.

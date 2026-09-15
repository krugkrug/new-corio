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
- `lanza` / `ejecuta` → primero el **triaje** (Paso 0.5 de `protocolo-cola.md`):
  toda tarea `sin-refinar` se descompone en fases con modelo asignado, o se
  bloquea preguntando si la descripción no basta. Después ejecuta las
  `pendiente` + `semaforo:verde` sin dependencia viva. Amarillas y rojas se
  preguntan, no se ejecutan.
- `nueva <título>` → añade la tarea a tareas.json preguntando antes prioridad,
  semáforo y dependencia. **Sin elegir modelo ni fases**: entra como
  `sin-refinar` y el triaje (Paso 0.5) la descompone y asigna modelo en la
  próxima pasada.
- `republica` / `publica` → republica `panel-tareas/index.html` sobre el Artifact
  existente (misma URL) subiendo `PANEL_VERSION`, sin tocar la cola.
- `sync` / `importa sesiones` → lista las sesiones de Claude Code activas
  (`mcp__ccd_session_mgmt__list_sessions`) y, para las que no tengan ya una tarea
  `en-curso` con esa `sesion.id` en `tareas.json`, las da de alta. Ver
  `references/sincronizar-sesiones.md`. **Solo funciona desde una sesión de
  Claude Code** — el panel web no tiene acceso a esta herramienta (no es un
  conector de claude.ai), así que esto no puede ser un botón del Artifact.
- `taskrun` → como `lanza`, pero un agente por repositorio en paralelo en vez de
  tarea a tarea en esta sesión. Ver `taskrun.md`.
- `jefe` → agente jefe: revisa el backlog y los 8 repos, prioriza con TOC y
  propone hasta 5 tareas nuevas con modelo y semáforo ya asignados. No ejecuta
  nada. Manual, on-demand por ahora (sin Routine). Ver `jefe.md`.
- un `owner/repo` → limita todo lo anterior a las tareas de ese repo.
- un número → abre esa tarea: descripción, notas completas, estado y qué falta.

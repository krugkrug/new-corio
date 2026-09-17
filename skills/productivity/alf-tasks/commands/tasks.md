---
description: Abre el panel de tareas y resume la cola (pendientes, bloqueadas, fantasmas)
---

Carga la skill `tasks` y ejecútala.

1. Abre el panel (webapp real en `https://home.sanchezbella.com/claudedash`,
   ya no un Artifact) en el navegador integrado.
2. Lee la cola con `python3 panel-tareas/tarea.py listar` (backend Blob,
   `CLAUDEDASH_BYPASS_SECRET` tiene que estar en el entorno). Resume:
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
- `nueva <título>` → añade la tarea a la cola preguntando antes prioridad,
  semáforo y dependencia. **Sin elegir modelo ni fases**: entra como
  `sin-refinar` y el triaje (Paso 0.5) la descompone y asigna modelo en la
  próxima pasada.
- `republica` / `publica` → ya no aplica: `home/claudedash/index.html` se
  despliega solo con el `git push` a `main` (Vercel autodeploy). Sube
  `PANEL_VERSION` en el archivo y haz push; no hay paso de "republicar".
- `sync` / `importa sesiones` → lista las sesiones de Claude Code activas
  (`mcp__ccd_session_mgmt__list_sessions`) y, para las que no tengan ya una tarea
  `en-curso` con esa `sesion.id`, las da de alta. Ver
  `references/sincronizar-sesiones.md`. **Solo funciona desde una sesión de
  Claude Code** — el panel web no tiene acceso a esta herramienta, así que esto
  no puede ser un botón del panel.
- `taskrun` → como `lanza`, pero un agente por repositorio en paralelo en vez de
  tarea a tarea en esta sesión. Ver `taskrun.md`.
- `jefe` → agente jefe: revisa el backlog y los 8 repos, prioriza con TOC y
  propone hasta 5 tareas nuevas con modelo y semáforo ya asignados. No ejecuta
  nada. Manual, on-demand por ahora (sin Routine). Ver `jefe.md`.
- un `owner/repo` → limita todo lo anterior a las tareas de ese repo.
- un número → abre esa tarea: descripción, notas completas, estado y qué falta.

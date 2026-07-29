---
description: Abre el panel de tareas y resume la cola (pendientes, bloqueadas, encalladas)
---

Carga la skill `tasks` y ejecútala.

1. Abre el panel (Artifact de claude.ai) en el navegador integrado.
2. Lee la cola de GitHub y resume el estado: pendientes por prioridad, bloqueadas
   esperando respuesta, y encalladas en `estado:en-curso` sin actividad.
3. No te quedes en "panel abierto": el resumen va en la misma respuesta.

Según `$ARGUMENTS`:

- vacío → abrir + resumen, sin tocar nada.
- `lanza` / `ejecuta` → además, **ejecuta** las tareas `semaforo:verde` +
  `estado:pendiente` siguiendo `references/protocolo-cola.md`. Las amarillas y rojas
  se preguntan, no se ejecutan.
- `nueva <título>` → crea la tarea preguntando antes prioridad, semáforo y modelo.
- `republica` / `publica` → republica `panel-tareas/index.html` sobre el Artifact
  existente (misma URL), sin tocar la cola.
- un `owner/repo` → limita todo lo anterior a ese repositorio.
- un `#N` → abre esa tarea concreta: hilo completo, estado y qué falta para cerrarla.

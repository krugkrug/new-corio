# Sincronizar sesiones de Claude Code → tareas.json

Cárgalo solo cuando el usuario pida `/tasks sync` o "importa las sesiones en
curso". Objetivo: que ninguna sesión de Claude Code trabajando de verdad quede
sin reflejo en el panel, y sin duplicar tareas que ya la tienen.

**Por qué esto no puede ser un botón del panel:** el panel es un Artifact de
claude.ai — solo puede declarar las capacidades `downloads` y `mcp` (conectores
de claude.ai como GitHub). `mcp__ccd_session_mgmt__list_sessions` es una
herramienta del *harness* de Claude Code, no un conector de claude.ai: el panel,
corriendo en un iframe del navegador, no puede verla ni llamarla. Por eso este
paso solo lo puede ejecutar una sesión de Claude Code (esta, o la routine).

## Paso 0 — sincronizar el archivo

```bash
git pull --rebase origin main
```

Lee `panel-tareas/tareas.json` tras el pull; es la verdad.

## Paso 1 — listar sesiones activas

Llama a `mcp__ccd_session_mgmt__list_sessions` (excluye la sesión actual por
diseño de la propia herramienta). Si necesitas más detalle de una (repo,
worktree/branch, modelo) usa `mcp__ccd_session_mgmt__get_session` con su id.

**No hay un esquema fijo documentado aquí a propósito** — inspecciona los campos
que realmente devuelve la llamada (título, rama, PR, modelo, si es remota,
vínculo con tarea programada, etc.) y úsalos tal cual vengan; no inventes campos
que no estén en la respuesta.

## Paso 2 — casar sesiones con tareas

Para cada sesión activa:

1. Busca en `tareas.json` una tarea con `estado: "en-curso"` y
   `sesion.id` igual al id de esa sesión. Si existe, **no la toques** — ya está
   reflejada.
2. Si no existe, decide si la sesión corresponde a una tarea `pendiente` ya
   encolada (mismo repo, mismo tema por título/rama) — si sí, esa es la tarea a
   actualizar, no crear una nueva.
3. Si no hay tarea previa que la explique, es trabajo que se puso en marcha
   fuera de la cola: da de alta una tarea nueva para que quede trazada.

## Paso 3 — escribir (una edición por sesión, con `sesion` releído antes)

Para una tarea existente (pendiente → en-curso, o refrescar una en-curso viva):

- `estado: "en-curso"`
- `sesion: {id, donde, desde}` — `donde` describe la sesión (título/rama si los
  tiene), `desde` es su hora de creación si `get_session` la da, si no la hora
  de este sync
- `actualizada`: ahora
- nota en `notas`: `{quien: "sync", cuando: ahora, texto: "Importada desde sesión activa <id> por /tasks sync."}`

Para una tarea nueva (mismos campos que cualquier alta, ver `SKILL.md` §2):
`prio` y `semaforo` sin evidencia para decidirlos van a `media` / `amarillo` —
que alguien los confirme, no se asumen verdes por defecto.

Sigue la regla de escrituras concurrentes de `protocolo-cola.md`: pull
inmediatamente antes de cada escritura, una tarea por commit, push inmediato.

## Al terminar

Resume en el chat: cuántas sesiones activas había, cuántas ya estaban
reflejadas, cuántas se actualizaron, cuántas tareas nuevas se crearon (con sus
ids). Si alguna sesión no se pudo casar con nada con confianza, dilo en vez de
adivinar — que decida Alfredo en la tarea creada.

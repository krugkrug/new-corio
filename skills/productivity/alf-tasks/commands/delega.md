---
description: Decide cómo ejecutar un trabajo —seguido en esta sesión, con subagente(s) o en worktree aislado— y lo lanza. Triaje de 5 preguntas, semáforo y presupuesto antes de lanzar.
---

# Delega — elegir el cauce y lanzar

Carga la skill `tasks` y `../skills/tasks/references/protocolo-cola.md`. Este
comando **no inventa un protocolo nuevo**: decide *dónde* corre el trabajo y
reutiliza lo que ya existe (`/taskrun` para tareas de la cola, `niveles-y-triaje.md`
para saber si el trabajo está listo para ejecutarse).

**Entrada**: texto libre («delega esto: …»), uno o varios ids de claudedash
(`/delega 46 47`), o nada (= lo último que se ha hablado).

## Paso 0 — ¿Está listo para ejecutarse?

Aplica `niveles-y-triaje.md`. Si hay más de una forma razonable de resolverlo
(nivel 3) o falta criterio de éxito (nivel 2), **no delegues**: sugiere
`/divergencia` o `/refinar`. Delegar algo ambiguo solo reparte la ambigüedad
(anti-patrón: construir sin objetivo claro). Si es una tarea de la cola con
repo, `semaforo` y `modelo` ya asignados, respétalos.

## Paso 1 — Trocea y clasifica cada paquete

Divide el trabajo en paquetes de una sola intención. Para cada uno, la primera
respuesta «sí» de esta tabla manda:

| # | Pregunta | Sí → cauce |
|---|---|---|
| 1 | ¿Es breve (< ~10 min, 1-3 archivos), o necesita el contexto de esta conversación, o depende del resultado del paquete anterior? | **A · Secuencial en la sesión** |
| 2 | ¿Es solo leer/buscar/revisar/analizar (sin commits), o produce mucho ruido que no quieres en tu contexto? | **B · Subagente** (`Explore` o `general-purpose`, sin worktree) |
| 3 | ¿Muta código con commits, dura más de ~15 min, o es de otro repo? | **C · Worktree aislado** (`Agent` con `isolation: worktree`, rama de sesión) |
| 4 | ¿Tiene que seguir corriendo con la sesión cerrada o tardar horas? | **D · Sesión remota** (`create_session`) — solo si Alfredo lo pide o lo acepta en el presupuesto |

Reglas de desempate:

- **Mismo repo y mismos archivos que otro paquete en marcha → serie, no
  paralelo** (A, o C uno tras otro). Dos agentes sobre el mismo working tree
  duplican trabajo y se pisan.
- **Paralelo solo si son independientes**: sin `dependeDe`, repos o archivos
  distintos. Los paquetes B y C independientes se lanzan **en el mismo turno**.
- Duda entre A y B → A (más barato y reversible). Duda entre B y C → si
  escribe, C.
- Un paquete que muta pero es trivial (1 archivo, 1 commit) → A, no montes
  un worktree para eso (sobre-ingeniería).

## Paso 2 — Semáforo y presupuesto (siempre antes de lanzar)

- 🔴 irreversible o caro (borrar, publicar, mandar emails, tocar producción,
  fusionar) → **no se delega ni se ejecuta** sin OK explícito.
- 🟡 ambiguo, o lanza ≥ 2 agentes / algún C o D → muestra la tabla y espera OK:

  > | Paquete | Cauce | Por qué | Modelo | Repo |
  > |---|---|---|---|---|
  > | #46 refactor X | C · worktree | muta + >15 min | sonnet | alfplan |
  > | revisar CI de ratioc | B · subagente | solo lectura | haiku | — |
  > | ajustar texto del README | A · aquí | 1 archivo | — | meta |
  >
  > Coste: 2 agentes + trabajo propio. ¿Lanzo?

- 🟢 todo A, o un único B de solo lectura → ejecuta y avisa en una línea.

Si Alfredo ya dijo «lanza» / «delega todo» en este turno, eso es el OK.

## Paso 3 — Lanza

- **A**: hazlo tú, en orden, sin más ceremonia.
- **B**: `Agent` con prompt **autocontenido** (el subagente no ve esta
  conversación): objetivo, qué devolver (conclusión corta, no volcado de
  archivos), límites (solo lectura).
- **C**: igual que `taskrun.md` Paso 7 —no lo reescribas, aplícalo—: `Agent`
  con `isolation: worktree`, modelo del paquete, prompt autocontenido con
  protocolo de `protocolo-cola.md`, rama de sesión **reutilizada** si ya hay una
  en ese repo, escrituras a la cola **solo con `tarea.py`**, QA con
  `code-review`, preview local y **sin abrir PR**. Si el paquete no está en la
  cola, dalo de alta antes (`/backlog` → `pendiente` con OK de Alfredo) para que
  quede trazado en Orquesta.
  Si la tarea es de otro repo que el de esta sesión, aplica la excepción del
  mismo Paso 7 de `taskrun.md` (worktree creado a mano, `Agent` sin `isolation`).
- **D**: `create_session` con la misma rama/prompt que C, y apunta el id de
  sesión en `notas` de la tarea.

**Deja rastro en la cola.** Por cada paquete que sea una tarea de claudedash,
antes de lanzarla: `python3 panel-tareas/tarea.py patch <id> --set
'{"cauce":"sesion|subagente|worktree|remota"}' --nota "Cauce: <cauce> — <por qué en una línea>"`.
El panel lo enseña en la tarjeta, el detalle y la vista Orquesta. Si el
cauce cambia a mitad (un A que crece), vuelve a parchearlo. Paquetes que no
están en la cola no escriben nada.

## Paso 4 — Cierre

Resumen de una tabla: paquete → cauce → resultado → rama y enlace
`http://localhost:<puerto>` (los C) → qué queda por pedir (PR). Nada queda
`hecha` por este comando: `hecha` = PR fusionado (`protocolo-cola.md`).
Añade en una línea qué cauce te pareció mal elegido, si alguno — alimenta la
afinación de esta tabla (Build → Measure → Learn).

## Guardarraíles

- Nunca delega sin criterio de éxito verificable.
- Nunca lanza amarillo/rojo sin OK ya registrado.
- Nunca dos agentes sobre el mismo repo a la vez.
- Nunca pasa a un agente tareas de otro repo.
- Nunca escribe en la cola a mano: `panel-tareas/tarea.py`.
- Delegar no sustituye al `code-review` ni a la rama de sesión.

## Quién la usa

- `/taskrun` clasifica sus lanzables con el Paso 1 de este comando; solo las
  de cauce C pasan a su lanzador de agentes por worktree.
- `/orquesta` y `/orquesta-repo` proponen `cauce` al crear tareas con esa misma
  tabla, sin ejecutarlas.

## Uso

- `/delega <texto>` — decide y propone cauce(s) para ese trabajo.
- `/delega <id> [<id>…]` — idem para tareas de la cola.
- `/delega` — para lo último que se ha hablado.

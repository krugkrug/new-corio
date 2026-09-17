---
description: Lanza toda la cola en paralelo — un agente por repositorio y modelo pedido, cada uno siguiendo protocolo-cola.md
---

Carga la skill `tasks` (contexto general) y
`../skills/tasks/references/protocolo-cola.md` (protocolo de ejecución) antes de
nada. Este comando es una variante de `/tasks lanza`: mismo criterio de qué se
ejecuta, pero repartido en varios agentes en vez de uno detrás de otro.

## Qué cambia frente a `/tasks lanza`

`/tasks lanza` ejecuta la cola tarea a tarea dentro de esta misma sesión, con el
modelo de la sesión actual — si hay lanzables en tres repos, se hacen una tras
otra. `/taskrun` agrupa las lanzables por repositorio y por el `modelo` pedido en
cada tarea, y lanza **un agente por grupo (repo, modelo), en paralelo entre
repos**, así que no hay que esperar a que un repo termine para empezar el
siguiente, y cada tarea corre con el modelo que se le pidió (`haiku` para lo
mecánico, `sonnet` por defecto, `opus` solo para lo complejo o ya aprobado).

## Pasos

1. `python3 panel-tareas/tarea.py listar` (backend Blob de claudedash,
   `CLAUDEDASH_BYPASS_SECRET` en el entorno). Es la fuente de verdad (Paso 0
   de `protocolo-cola.md`) — ya no es `tareas.json` en git.
2. Sanea lo barato antes de decidir: `en-curso` sin `sesion` o con `sesion` sin
   actividad reciente (más de 15 min), `dependeDe` que ya apunta a una tarea
   hecha o descartada. Anota cualquier saneo en `notas` de esa tarea.
3. Calcula las **lanzables**: `pendiente` + `semaforo:verde` + sin dependencia
   viva. Amarillo y rojo no se lanzan nunca por este camino — se bloquean con
   pregunta concreta, igual que en `/tasks lanza`.
4. **Refina antes de lanzar.** Para cada lanzable, comprueba si `descripcion`
   basta para ejecutarla sin nadie delante: criterio de éxito claro y, si aplica,
   el archivo o comportamiento al que se refiere. Si no basta — el caso de la
   tarea 3 original, "cierra el ciclo" sin más contexto — no la lances: bloquéala
   con la pregunta concreta (Paso 1 de `protocolo-cola.md`). No inventes spec
   donde no la hay ni la fuerces a un agente que no puede pedir aclaración a
   mitad de tarea.
5. Agrupa las lanzables ya refinadas por `repo` y, dentro de cada repo, por
   `modelo` (`haiku` / `sonnet` / `opus`) — el campo `modelo` de la tarea se
   traduce **literalmente** al parámetro `model` de la herramienta Agent, sin
   tabla de mapeo. Si un repo ya tiene una tarea `en-curso` con sesión activa
   (no fantasma) de otra sesión, no le lances un agente duplicado: repórtalo y
   sigue con el resto de repos.
6. Por cada grupo (repo, modelo) con lanzables, invoca la herramienta **Agent**
   (`subagent_type: claude`, `model: <el modelo del grupo>`, `isolation:
   worktree` — va a mutar archivos y hacer commits) con un prompt autocontenido
   que incluya:
   - la lista de tareas de ESE grupo únicamente (id, título, descripción
     completa, prio);
   - el protocolo de `protocolo-cola.md` completo o resumido con precisión —
     el agente no tiene el resto de esta conversación, e incluye el paso de
     QA con `code-review` antes de cerrar;
   - la instrucción explícita: marcar `en-curso` con `sesion` antes de tocar
     nada, entregar trunk-based con push directo a `main`, verificar
     "CONFIRMADO EN MAIN" antes de marcar nada `hecha`, y bloquear con pregunta
     concreta si algo no cuadra (nunca forzar una suposición no declarada).
   Lanza en paralelo, en el mismo turno, todos los grupos de **repos
   distintos**. Si un mismo repo tiene lanzables con más de un `modelo`, esos
   grupos comparten repo y no se lanzan a la vez: van en serie (uno termina,
   entrega y libera el repo, antes de lanzar el siguiente grupo de ese mismo
   repo) para no duplicar trabajo sobre el mismo working tree/push a `main`.
7. Cuando los agentes terminen, `git pull` y resume en la respuesta: qué quedó
   `hecha`, qué se bloqueó y por qué, y qué no se tocó (repo ya ocupado, sin
   lanzables, etc.).

## Guardarraíles (no negociables)

- Nunca lanza amarillo/rojo sin respuesta de Alfredo ya registrada en `notas`.
- Nunca marca `hecha` sin "CONFIRMADO EN MAIN" de esa sesión.
- Cada agente trabaja **su** repo únicamente — no le pases tareas de otro repo,
  y no dejes que dos agentes toquen el mismo repo a la vez.
- Escrituras a la cola: siempre con `panel-tareas/tarea.py` (nunca a mano
  contra `/api/claudedash`) — relee fresco y toca solo una tarea, con `ifMatch`
  para no pisar lo que otro grupo o el panel acaben de escribir. Ver
  `protocolo-cola.md`. **Incluye explícitamente esta instrucción en el prompt
  de cada agente**: un agente que lea el estado al empezar y lo vuelva a
  escribir entero al cerrar (en vez de usar `tarea.py`) puede pisar tareas
  dadas de alta por el panel mientras trabajaba — pasó el 16/09/2026 con la
  tarea 14 (en la era git), que se llevó por delante las tareas 15 y 16.

## Uso

- `/tasks taskrun` — agentes en paralelo para todos los repos con lanzables.
- `/tasks taskrun <owner/repo>` — limita a ese repo (en la práctica, un solo
  agente; útil para probar el comando sin arrancar todo a la vez).

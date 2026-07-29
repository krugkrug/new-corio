---
description: Lanza toda la cola en paralelo — un agente por repositorio, cada uno siguiendo protocolo-cola.md
---

Carga la skill `tasks` (contexto general) y
`../skills/tasks/references/protocolo-cola.md` (protocolo de ejecución) antes de
nada. Este comando es una variante de `/tasks lanza`: mismo criterio de qué se
ejecuta, pero repartido en varios agentes en vez de uno detrás de otro.

## Qué cambia frente a `/tasks lanza`

`/tasks lanza` ejecuta la cola tarea a tarea dentro de esta misma sesión — si hay
lanzables en tres repos, se hacen una tras otra. `/taskrun` agrupa las lanzables
por repositorio y lanza **un agente por repo, en paralelo**, así que no hay que
esperar a que un repo termine para empezar el siguiente.

## Pasos

1. `git pull --rebase origin main` en `krugkrug/meta` y lee `tareas.json`. Es la
   fuente de verdad (Paso 0 de `protocolo-cola.md`).
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
5. Agrupa las lanzables ya refinadas por `repo`. Si un repo ya tiene una tarea
   `en-curso` con sesión activa (no fantasma) de otra sesión, no le lances un
   agente duplicado: repórtalo y sigue con el resto de repos.
6. Por cada repo con lanzables, invoca la herramienta **Agent**
   (`subagent_type: claude`, `isolation: worktree` — va a mutar archivos y hacer
   commits) con un prompt autocontenido que incluya:
   - la lista de tareas de ESE repo únicamente (id, título, descripción
     completa, prio, modelo pedido);
   - el protocolo de `protocolo-cola.md` completo o resumido con precisión —
     el agente no tiene el resto de esta conversación;
   - la instrucción explícita: marcar `en-curso` con `sesion` antes de tocar
     nada, entregar trunk-based con push directo a `main`, verificar
     "CONFIRMADO EN MAIN" antes de marcar nada `hecha`, y bloquear con pregunta
     concreta si algo no cuadra (nunca forzar una suposición no declarada).
   Lanza todos los repos en el mismo turno (varias llamadas a Agent en paralelo),
   no uno y esperar al siguiente.
7. Cuando los agentes terminen, `git pull` y resume en la respuesta: qué quedó
   `hecha`, qué se bloqueó y por qué, y qué no se tocó (repo ya ocupado, sin
   lanzables, etc.).

## Guardarraíles (no negociables)

- Nunca lanza amarillo/rojo sin respuesta de Alfredo ya registrada en `notas`.
- Nunca marca `hecha` sin "CONFIRMADO EN MAIN" de esa sesión.
- Cada agente trabaja **su** repo únicamente — no le pases tareas de otro repo,
  y no dejes que dos agentes toquen el mismo repo a la vez.
- Escrituras a `tareas.json`: pull inmediatamente antes de cada escritura,
  escritura pequeña (una tarea cada vez cuando sea posible), push inmediato —
  igual que dicta `protocolo-cola.md` para las escrituras concurrentes.

## Uso

- `/tasks taskrun` — agentes en paralelo para todos los repos con lanzables.
- `/tasks taskrun <owner/repo>` — limita a ese repo (en la práctica, un solo
  agente; útil para probar el comando sin arrancar todo a la vez).

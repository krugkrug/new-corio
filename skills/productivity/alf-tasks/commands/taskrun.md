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
   `CLAUDEDASH_PASSWORD` en el entorno). Es la fuente de verdad (Paso 0
   de `protocolo-cola.md`) — ya no es `tareas.json` en git.
2. Sanea lo barato antes de decidir: `en-curso` sin `sesion` o con `sesion` sin
   actividad reciente (más de 15 min), `dependeDe` que ya apunta a una tarea
   hecha o descartada. Anota cualquier saneo en `notas` de esa tarea. Y **pasa la
   reconciliación** (Paso 0.2 de `protocolo-cola.md`): las `en-curso` cuyo PR ya
   se fusionó se cierran aquí — si no, se quedan ocupando su repo y bloqueando el
   agente siguiente.
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
4.5. **Clasifica con `/delega`** (Paso 1 de `delega.md`, tabla de 4 cauces) cada
   lanzable ya refinada. Solo las de cauce **C · worktree** (y **D · remota** si
   Alfredo la acepta) siguen por los Pasos 5-8 como agentes por repo/modelo. Las
   de cauce **A · sesión** y **B · subagente** las ejecuta `/delega` por su
   cuenta (Pasos 3-4 de `delega.md`) en vez de montar un worktree para algo
   trivial o de solo lectura. Si la tarea ya trae `cauce`, respétalo. El
   presupuesto del Paso 6 es **uno solo** y lista todos los cauces, no uno por
   comando. Este comando sigue siendo la definición de cómo se lanza un C
   (Paso 7): `/delega` remite aquí, no lo duplica.
5. Agrupa las lanzables de cauce C ya refinadas por `repo` y, dentro de cada repo, por
   `modelo` (`haiku` / `sonnet` / `opus`) — el campo `modelo` de la tarea se
   traduce **literalmente** al parámetro `model` de la herramienta Agent, sin
   tabla de mapeo. Si un repo ya tiene una tarea `en-curso` con sesión activa
   (no fantasma) de otra sesión, no le lances un agente duplicado: repórtalo y
   sigue con el resto de repos.

   **La rama es de esta sesión, no de la tarea ni de esta ronda de `taskrun`**
   (`PROCESO_DESARROLLO.md` §3, 23/09/2026(2)): antes de lanzar, por cada repo
   comprueba `python3 panel-tareas/orquesta.py listar --repo <owner/repo>`
   buscando una fila con `sesion.id` igual al de esta sesión. Si existe, esa es
   la rama para **todos** los grupos de ese repo en esta ronda; si además esta
   sesión ya lanzó otras rondas de `taskrun` antes (sobre este mismo repo, con
   otros requerimientos), es la misma rama de aquella vez, no una nueva. Si no
   existe ninguna, decide ahora el nombre (`<tipo>/<asunto>` de la lanzable de
   mayor prioridad del grupo) — esa nace con la primera tarea y las siguientes,
   de esta ronda o de una futura, la reutilizan.
6. **Enseña el presupuesto y espera el OK.** Antes de lanzar nada, una tabla:
   un grupo por fila con repo, modelo, cuántas tareas y sus ids. `/taskrun` puede
   arrancar una docena de agentes de golpe y eso no es reversible ni barato —
   por el semáforo de `CLAUDE.md` es 🟡, no 🟢. Ejemplo:

   > 3 agentes · alfplan (opus, 2 tareas: #46, #47) · meta (haiku, 1: #51) ·
   > coriodash (sonnet, 1: #52). ¿Lanzo?

   Si Alfredo ya dijo «lanza todo» o equivalente en este turno, ese es el OK y no
   se vuelve a preguntar. Con un solo grupo de modelo barato (`haiku`), tampoco:
   avisa en una línea y sigue.
7. Por cada grupo (repo, modelo) con lanzables, invoca la herramienta **Agent**
   (`subagent_type: claude`, `model: <el modelo del grupo>`, `isolation:
   worktree` — va a mutar archivos y hacer commits) con un prompt autocontenido
   que incluya:
   - la lista de tareas de ESE grupo únicamente (id, título, descripción
     completa, prio);
   - el protocolo de `protocolo-cola.md` completo o resumido con precisión —
     el agente no tiene el resto de esta conversación, e incluye el paso de
     QA con `code-review` antes de cerrar;
   - la instrucción de **leer `meta/PROCESO_DESARROLLO.md` §3 y §7** en su repo
     (está en todos, lo propaga `sync-a-repos.yml`): el flujo de entrega y los
     cuatro estados de una rama. Si en ese repo no existe todavía, resúmeselos en
     el prompt — un agente con el flujo de entrega equivocado empuja a `main`;
   - la instrucción explícita: marcar `en-curso` con `sesion` antes de tocar
     nada, entregar **en la rama de esta sesión para este repo** (la que le
     pasas en el prompt — Paso 5: `git checkout <rama> 2>/dev/null || git
     checkout -b <rama>`, nunca push a `main`, nunca una rama nueva si ya hay
     una de esta sesión en este repo), registrarla **enlazada a su tarea** con
     `orquesta.py autodetectar --repo . --tarea <id>`, **no abrir el PR** —lo pide
     Alfredo, y abrirlo es fusionar—, dejar la tarea `en-curso` hasta que ese PR
     se fusione, dejar el preview local levantado con su enlace
     `http://localhost:<puerto>` (`PROCESO_DESARROLLO.md` §3) y reportarlo en su
     cierre, cerrar con la nota de cierre estándar (qué se hizo · dónde está ·
     qué dijo `code-review` · cómo verificarlo), y bloquear con pregunta concreta
     si algo no cuadra (nunca forzar una suposición no declarada).
   **Excepción: tarea de un repo distinto al de esta sesión.** `isolation: worktree`
   crea el worktree sobre el repo del directorio de trabajo de la sesión, no sobre
   el del grupo. Si el repo de la tarea es otro, crea tú el worktree
   (`git -C <repo> fetch && git -C <repo> worktree add -b <rama> <ruta> origin/main`,
   ruta fuera de `Documents/GitHub` para que `/cierre` no la confunda con un repo),
   lanza el `Agent` **sin** `isolation` y dile en el prompt que trabaje solo en esa
   ruta y compruebe antes `git log` y `git status` (probado con la #196 de
   ratioc, 3-oct-2026).
   Lanza en paralelo, en el mismo turno, todos los grupos de **repos
   distintos**. Si un mismo repo tiene lanzables con más de un `modelo`, esos
   grupos comparten repo y no se lanzan a la vez: van en serie (uno termina,
   entrega y libera el repo, antes de lanzar el siguiente grupo de ese mismo
   repo) para no duplicar trabajo sobre el mismo working tree/push a `main`.
8. Cuando los agentes terminen, `git pull` y resume en la respuesta: por cada
   repo tocado, **una fila con su rama de sesión** (no una por tarea — si el
   repo resolvió varias lanzables, todas están en la misma rama) y **su enlace
   local** `http://localhost:<puerto>` de preview — nunca cierres el resumen sin
   ese enlace, es lo que sustituye a revisar el PR (`PROCESO_DESARROLLO.md` §3).
   Añade qué se bloqueó y por qué, y qué no se tocó (repo ya ocupado, sin
   lanzables, etc.). **Ninguna tarea queda `hecha` por este comando**: quedan
   `en-curso` con su rama, y se cierran en el Paso 0.2 (reconciliación) cuando
   Alfredo pida el PR y este se fusione. Dilo explícito en el resumen, con los
   PR que faltan por pedir.

## Guardarraíles (no negociables)

- **Nunca lanza sin enseñar antes el presupuesto** (Paso 6) — salvo un único
  grupo con modelo barato, o un «lanza todo» ya dicho en este turno.
- Nunca lanza amarillo/rojo sin respuesta de Alfredo ya registrada en `notas`.
- Nunca marca `hecha` con el trabajo solo en la rama: `hecha` es cuando el PR se
  ha fusionado a `main`. Mientras tanto, `en-curso`.
- Cada agente trabaja **su** repo únicamente — no le pases tareas de otro repo,
  y no dejes que dos agentes toquen el mismo repo a la vez. Con `isolation:
  worktree` cada uno tiene su working directory; la rama es de la sesión (no
  del agente ni de la tarea) y se ve en Orquesta.
- **Nunca crea una rama nueva por repo si esta sesión ya tiene una viva ahí**
  — ni por tarea, ni por ronda de `taskrun`: se reutiliza, aunque cambie el
  requerimiento o hayan pasado varias llamadas a este comando. Comprobarlo es
  el primer paso del Paso 5, no una opción.
- Nunca cierra el resumen final sin el enlace local (`http://localhost:<puerto>`)
  de cada repo tocado — sin eso no hay con qué revisar en local, y revisar en
  local es lo único que sustituye al PR mientras la rama de sesión no se pide.
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

---
description: Orquestador acotado a un solo repo — mismo rol de PM que /orquesta, sin recorrer los 8 repos. Manual, on-demand.
---

> Variante de `/orquesta` para cuando solo quieres revisar **un** repo (el que
> estás tocando ahora, o el que le pases como argumento) en vez de la ronda
> completa de los 8. Mismo rol de PM, mismos guardarraíles — solo cambia el
> alcance del Paso 2/3.

Repo objetivo: `$ARGUMENTS`. Si viene vacío, usa el repo del directorio de
trabajo actual (deduce el nombre del remoto `origin` con `git remote -v` si
hace falta). Si el nombre no está en la tabla de `PROCESO_DESARROLLO.md` §2
(`meta`, `alfbank`, `coriodash`, `prado`, `ratioc`, `gt`, `news`, `alfplan`),
dilo y para — no adivines un repo que no existe en el proceso.

Carga la skill `tasks` (contexto general) y
`../skills/tasks/references/protocolo-cola.md` (Pasos 0 y 0.2, saneo y
reconciliación — no ejecuta nada de Paso 1/2, solo gestiona el tablero). Este
comando **no toca código ni marca nada `hecha` por trabajo propio**: es el rol
de PM del equipo de agentes, separado del rol de ejecutor (`/tasks lanza` /
`/tasks taskrun`).

Fuera de alcance a propósito: el pipeline de voz/email (`claudedashxls.xlsx`,
skill `pipeline`) es un canal independiente por ahora — este comando no lo lee
ni escribe en él.

## Pasos

0. `python3 panel-tareas/doctor.py` **antes que nada**. Si sale algún ✗ de
   plugin o almacén, dilo y **para**: revisar el tablero con el plugin
   desincronizado o contra un almacén muerto es cómo se acaba reportando un
   backlog que ya no existe. Los ✗ de cola y los avisos de documentos no paran
   nada: entran como señales del Paso 4.
1. `python3 panel-tareas/tarea.py listar` (backend Blob de claudedash,
   `CLAUDEDASH_PASSWORD` en el entorno), **filtrado al repo objetivo**.
   Aplica el saneo barato del Paso 0 de `protocolo-cola.md` (fantasmas,
   dependencias ya resueltas) con `tarea.py patch` si tocó algo, más la
   reconciliación del Paso 0.2 — solo sobre tareas de este repo.
2. Solo para el **repo objetivo**:
   - último estado de CI en `main` (`mcp__github__list_commits` +
     `mcp__github__actions_list`/`get_check_run` sobre el commit más
     reciente).
   - PRs abiertos y su antigüedad (`mcp__github__list_pull_requests`).
3. **Revisa también las ramas** del repo objetivo, que es donde se pierde el
   trabajo terminado. Con el repo clonado en `~/Documents/GitHub/<repo>`:

   ```bash
   python3 panel-tareas/orquesta.py autodetectar --repo ~/Documents/GitHub/<repo>
   python3 panel-tareas/orquesta.py purgar --repo ~/Documents/GitHub/<repo>
   ```

   Eso deja el panel al día para ese repo. Luego
   `orquesta.py listar --estado huerfana --repo <repo>` (si el flag no existe,
   filtra el resultado a mano por el campo `repo`).

4. Detecta **solo señales objetivas**, nunca ideas especulativas (anti-patrón:
   construir sin objetivo claro), **todas dentro del repo objetivo**:
   - **Rama huérfana** (commits propios y ningún PR): es trabajo hecho que
     nadie va a fusionar — la señal que más cuesta, porque no duele hasta que
     se olvida. Una tarea por cada una: «decidir X — abrir PR o descartar»,
     con la rama y el título del commit en la descripción. **Nunca propongas
     borrarla tú**: eso es decisión de Alfredo (`semaforo: amarillo`).
   - **Rama viva de más de una semana**: o se partió mal o se abandonó. Tarea
     para revisarla, no para cerrarla.
   - CI rojo en `main` sin tarea abierta que lo cubra.
   - Tarea `bloqueada` con `necesitaRespuesta: true` de hace más de 3 días sin
     nota nueva de Alfredo — no la repite, la resume.
   - Tarea `pendiente` cuya descripción no basta para ejecutarla sola (mismo
     criterio que el Paso 4 de `taskrun.md`) → la trocea en subtareas con
     `dependeDe` entre ellas en vez de dejarla ambigua.
   - Dependencias circulares o rotas dentro del repo.
5. **Prioriza con TOC**: identifica un único cuello de botella dentro de este
   repo y marca esa tarea (nueva o existente) `prio: alta`. El resto que
   toques, `media`/`baja`. Dilo explícito en la nota: *"Aplico TOC: cuello de
   botella = <qué y por qué>"*.
6. Redacta como máximo **5 tareas nuevas** por corrida (tope duro, igual que
   `/orquesta`). Si hay más señales de las que caben, prioriza las 5 más
   claras y deja las demás anotadas como comentario en tu resumen final
   (Paso 8), no las crees. Para cada tarea nueva:
   - `repo` = el repo objetivo (nunca dejes esto ambiguo).
   - criterio de éxito verificable sin nadie delante (mismo estándar que
     `taskrun.md` Paso 4).
   - `modelo`: `haiku` si es mecánica y bien acotada, `sonnet` por defecto,
     `opus` solo si es arquitectura/ambigüedad real.
   - `semaforo`: `verde` solo si es reversible y barata; si no, `amarillo`/
     `rojo` con la pregunta concreta ya puesta en `notas` y
     `necesitaRespuesta: true` — **nunca te autoapruebas** un amarillo o rojo.
7. Escribe con `tarea.py` (misma disciplina de escrituras concurrentes de
   `protocolo-cola.md`: relee fresco, una tarea por escritura, `ifMatch` con
   reintento).
8. Cierra con un resumen y notifica con la herramienta **PushNotification**
   (una línea, <200 caracteres): repo revisado, cuántas tareas nuevas, cuál es
   el cuello de botella de TOC, cuántas quedaron esperando respuesta tuya. La
   misma respuesta de esta sesión lleva el resumen completo.

## Guardarraíles (no negociables)

- **Nunca revisa el tablero sin pasar antes `doctor.py`** — y para si el
  plugin o el almacén salen en rojo.
- Nunca sale del repo objetivo: si detectas una señal clara en otro repo
  (p. ej. CI rojo que ves de pasada), la nombras en el resumen final pero no
  creas tarea para ella — eso es trabajo de `/orquesta` (ronda completa) o de
  correr este mismo comando sobre ese otro repo.
- Nunca ejecuta tareas — solo gestiona el tablero. La única `hecha` que puede
  poner es la de la reconciliación (Paso 0.2): una tarea cuyo PR ya está
  fusionado en `main`, que es un hecho comprobable, no un juicio.
- **Nunca propone borrar una rama huérfana**: se propone decidirla, en
  amarillo.
- Nunca crea más de 5 tareas nuevas por corrida.
- Nunca pone `verde` a algo que no sea claramente reversible y barato.
- Nunca repite una pregunta ya hecha en una `bloqueada` — la resume, no la
  duplica.

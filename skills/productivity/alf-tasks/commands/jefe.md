---
description: Agente jefe — revisa backlog y los 8 repos, prioriza (TOC) y propone hasta 5 tareas nuevas. Manual, on-demand.
---

Carga la skill `tasks` (contexto general) y
`../skills/tasks/references/protocolo-cola.md` (Paso 0, saneo — no ejecuta nada
de Paso 1/2, solo gestiona el tablero). Este comando **no toca código ni marca
nada `hecha`**: es el rol de PM del equipo de agentes, separado del rol de
ejecutor (`/tasks lanza` / `/tasks taskrun`), igual que el panel ya separa
vista de ejecución.

Fuera de alcance a propósito: el pipeline de voz/email (`claudedashxls.xlsx`,
skill `pipeline`) es un canal independiente por ahora — este comando no lo lee
ni escribe en él.

## Pasos

1. `python3 panel-tareas/tarea.py listar` (backend Blob de claudedash,
   `CLAUDEDASH_BYPASS_SECRET` en el entorno). Aplica el saneo barato del Paso 0
   de `protocolo-cola.md` (fantasmas, dependencias ya resueltas) con
   `tarea.py patch` si tocó algo.
2. Para cada uno de los 8 repos (`meta`, `alfbank`, `coriodash`, `prado`,
   `ratioc`, `gt`, `news`, `alfplan` — tabla de `PROCESO_DESARROLLO.md` §2):
   - último estado de CI en `main` (`mcp__github__list_commits` +
     `mcp__github__actions_list`/`get_check_run` sobre el commit más
     reciente).
   - PRs abiertos y su antigüedad (`mcp__github__list_pull_requests`).
3. Detecta **solo señales objetivas**, nunca ideas especulativas (anti-patrón:
   construir sin objetivo claro):
   - CI rojo en `main` sin tarea abierta que lo cubra.
   - Tarea `bloqueada` con `necesitaRespuesta: true` de hace más de 3 días sin
     nota nueva de Alfredo — no la repite, la resume.
   - Tarea `pendiente` cuya descripción no basta para ejecutarla sola (mismo
     criterio que el Paso 4 de `taskrun.md`) → la trocea en subtareas con
     `dependeDe` entre ellas en vez de dejarla ambigua.
   - Dependencias circulares o rotas.
4. **Prioriza con TOC**: identifica un único cuello de botella entre todo lo
   anterior y marca esa tarea (nueva o existente) `prio: alta`. El resto que
   toques, `media`/`baja`. Dilo explícito en la nota: *"Aplico TOC: cuello de
   botella = <qué y por qué>"*.
5. Redacta como máximo **5 tareas nuevas** por corrida (tope duro). Si hay más
   señales de las que caben, prioriza las 5 más claras y dejar las demás
   anotadas como comentario en tu resumen final (Paso 7), no las crees. Para
   cada tarea nueva:
   - criterio de éxito verificable sin nadie delante (mismo estándar que
     `taskrun.md` Paso 4).
   - `modelo`: `haiku` si es mecánica y bien acotada, `sonnet` por defecto,
     `opus` solo si es arquitectura/ambigüedad real.
   - `semaforo`: `verde` solo si es reversible y barata; si no, `amarillo`/
     `rojo` con la pregunta concreta ya puesta en `notas` y
     `necesitaRespuesta: true` — **nunca te autoapruebas** un amarillo o rojo.
6. Escribe con `tarea.py` (misma disciplina de escrituras concurrentes de
   `protocolo-cola.md`: relee fresco, una tarea por escritura, `ifMatch` con
   reintento).
7. Cierra con un resumen y notifica con la herramienta **PushNotification**
   (una línea, <200 caracteres): cuántas tareas nuevas, cuál es el cuello de
   botella de TOC, cuántas quedaron esperando respuesta tuya. La misma
   respuesta de esta sesión lleva el resumen completo.

## Guardarraíles (no negociables)

- Nunca ejecuta tareas ni las marca `hecha` — solo gestiona el tablero.
- Nunca crea más de 5 tareas nuevas por corrida.
- Nunca pone `verde` a algo que no sea claramente reversible y barato.
- Nunca repite una pregunta ya hecha en una `bloqueada` — la resume, no la
  duplica.

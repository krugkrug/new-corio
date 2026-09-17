---
name: tasks
description: Abre el panel de tareas de Alfredo y ejecuta su cola. Las tareas viven en un backend Blob propio (home/api/claudedash.ts, home.sanchezbella.com/api/claudedash); el panel es una webapp real (home/claudedash) que habla HTTP directo con ese backend, y quien ejecuta es una sesión de Claude Code. Úsala cuando el usuario diga "/tasks", "abre el panel", "el panel de tareas", "lanza las tareas", "ejecuta la cola", "qué tengo pendiente", "tareas pendientes" o pregunte por el estado de sus tareas — aunque no mencione la palabra "panel".
---

# Panel de tareas — abrir y ejecutar la cola

**Versión:** v3.0 · **Fecha:** 16/09/2026 · **Responsable:** Alfredo Sánchez-Bella Solís
> v3.0: corte de git/Artifact a claudedash. El almacén pasa de
> `panel-tareas/tareas.json` (git) a un backend Blob propio servido en
> `home.sanchezbella.com/api/claudedash`; el panel deja de ser un Artifact de
> claude.ai y pasa a ser una webapp real (`home/claudedash/index.html`) con
> `fetch()` directo. `panel-tareas/tarea.py` habla HTTP en vez de git.
> v2.0 (histórica): el almacén pasó de GitHub Issues a `tareas.json`.

Esta skill hace tres cosas: **(1) abre el panel**, **(2) sincroniza sesiones
activas** (`/tasks sync`) y **(3) hace de ejecutor de la cola**, las dos
últimas solo cuando el usuario lo pide.

---

## 1. Abrir el panel (siempre lo primero)

Webapp real, no Artifact:

> **https://home.sanchezbella.com/claudedash**

Ábrela en el navegador integrado (`preview_start {url}`). Si no hay navegador, da
el enlace y sigue: el panel es una comodidad visual, no una dependencia — para
leer la cola desde una sesión de Claude Code usa `panel-tareas/tarea.py listar`
(§2), no hace falta el navegador para eso.

Luego, en la misma respuesta, lee la cola (§2) y resume: pendientes por prioridad,
bloqueadas esperando respuesta, y en-curso — señalando cualquier tarea en curso
**sin `sesion` declarada** (tarjeta fantasma: nadie está trabajando de verdad).

**Fuente del panel:** `home/claudedash/index.html` en `krugkrug/meta`. A
diferencia de la era Artifact, un `git push` a `main` lo despliega solo (Vercel
autodeploy) — no hace falta "republicar" nada. Al tocar el archivo sube
`PANEL_VERSION` — el badge junto al título delata un deploy que aún no ha
llegado. El panel vive detrás de SSO de Vercel: un navegador con sesión pasa
sin más, un script necesita el bypass de automatización (ver §2).

---

## 2. Dónde viven las tareas

**Backend Blob propio: `home/api/claudedash.ts`, servido en
`home.sanchezbella.com/api/claudedash`.** Un solo documento para todos los
repositorios: el repo donde se trabaja es el campo `repo` de cada tarea. Desde
una sesión de Claude Code se lee y **se edita solo con `panel-tareas/tarea.py`**
(nunca a mano) — get/patch/nueva/archivar/listar, todo por HTTP con bloqueo
optimista (`ifMatch` sobre `actualizado`; 409 si otra escritura ganó la
carrera, reintenta solo). El panel usa el mismo backend con `fetch()` directo.

**`tarea.py` necesita `CLAUDEDASH_BYPASS_SECRET` en el entorno** (variable de
shell — p. ej. `~/.zshenv` — nunca en el repo ni pegada en el chat): el secreto
de "Protection Bypass for Automation" de Vercel (proyecto `home` → Settings →
Deployment Protection), sin el cual el script recibe 401 "Protected
deployment". Si falta, el propio script lo dice con un mensaje explícito.

Campos: `prio` (alta/media/baja) · `semaforo` (verde/amarillo/rojo — **el
guardarraíl real**) · `estado` (backlog/pendiente/en-curso/bloqueada/hecha/descartada
— `backlog` es donde entra toda tarea nueva desde el panel v14 y **nunca se
lanza sola**, ni en verde; sale a mano promovida a `pendiente` desde la vista
Planificación) · `modelo` (haiku/sonnet/opus — se asigna al promover desde
backlog, respétalo si puedes elegir) · `dependeDe` (id; bloquea mientras esa
tarea no esté hecha ni descartada; solo mismo repo) · `necesitaRespuesta` (bool)
· `sesion` (`{id, donde, desde}` o null) · `notas` (hilo de la tarea: `{quien,
cuando, texto}`).

Detalle completo de campos y trampas: `panel-tareas/README.md`.

---

## 3. Sincronizar sesiones activas

`/tasks sync` da de alta en la cola las sesiones de Claude Code que están
trabajando de verdad pero no tienen tarea `en-curso` asociada. Solo funciona
desde Claude Code (`mcp__ccd_session_mgmt__list_sessions` no es una API HTTP
pública, así que el panel no puede llamarlo). Protocolo completo:
`references/sincronizar-sesiones.md`.

## 4. Ejecutar la cola

Cuando el usuario diga "lanza las tareas" o similar, carga
`references/protocolo-cola.md` y síguelo. Resumen de una línea por regla:

1. `panel-tareas/tarea.py listar` antes de nada; el backend es la verdad (no
   hace falta `git pull` para la cola — sí para el repo donde se trabaja).
2. Solo se ejecutan las `pendiente` + `semaforo:verde` + sin dependencia viva.
   Amarillo/rojo: pregunta y bloquea, sin tocar nada.
3. Al empezar una tarea, **rellena `sesion`** y pon `en-curso` — sin eso el panel
   enseña una tarjeta fantasma.
4. Entrega trunk-based en el repo de la tarea: push directo a `main`,
   verificado, y solo entonces `hecha` en la cola.
5. Todo cambio de estado se anota en `notas` — es parte del registro de
   auditoría, junto con `claudedash-audit.ndjson` (qué ids cambiaron y cuándo).

**Quién ejecuta:** una routine de Claude Code en la nube (existe y ha entregado
trabajo real) o esta misma sesión. GitHub Actions está descartado: el workflow
`tareas.yml` está `disabled_manually` en los repos y el token OAuth se rechaza —
historia completa en el README. **Poner una tarea en pendiente no lanza nada por
sí solo**: alguien tiene que leer la cola.

---

## Anti-patrones

- Marcar `hecha` sin push verificado en `main` (del repo de la tarea).
- Ponerse a trabajar sin rellenar `sesion` (tarjeta fantasma).
- Bloquear sin poner `necesitaRespuesta` (la pregunta desaparece del radar).
- Tocar algo en amarillo o rojo sin respuesta explícita de Alfredo.
- **Escribir el documento reconstruyéndolo entero desde una copia en memoria en
  vez de con `tarea.py`** — así se pisaron las tareas 15 y 16 el 16/09/2026,
  en la era git (ver `references/protocolo-cola.md`). `tarea.py` relee fresco
  y manda `ifMatch`; hacerlo a mano en una sesión larga es justo el fallo que
  existe para evitar.
- Invocar `tarea.py` sin `CLAUDEDASH_BYPASS_SECRET` en el entorno — falla con
  401 "Protected deployment" (SSO de Vercel en `home`).
- Volver a preguntar lo que ya está contestado en `notas`.
- Usar los GitHub Issues como cola: eso murió el 29/07/2026.

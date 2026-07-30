---
name: tasks
description: Abre el panel de tareas de Alfredo y ejecuta su cola. Las tareas viven en panel-tareas/tareas.json del repo krugkrug/meta (un solo archivo para todos los repos); el panel es un Artifact privado de claude.ai que lo lee y escribe por el conector GitHub, y quien ejecuta es una sesión de Claude Code. Úsala cuando el usuario diga "/tasks", "abre el panel", "el panel de tareas", "lanza las tareas", "ejecuta la cola", "qué tengo pendiente", "tareas pendientes" o pregunte por el estado de sus tareas — aunque no mencione la palabra "panel".
---

# Panel de tareas — abrir y ejecutar la cola

**Versión:** v2.0 · **Fecha:** 29/07/2026 · **Responsable:** Alfredo Sánchez-Bella Solís
> v2.0: el almacén pasa de GitHub Issues a `panel-tareas/tareas.json`. Todo lo de
> etiquetas `estado:*`, `gh issue edit` y transiciones atómicas queda obsoleto.

Esta skill hace tres cosas: **(1) abre el panel**, **(2) sincroniza sesiones
activas** (`/tasks sync`) y **(3) hace de ejecutor de la cola**, las dos
últimas solo cuando el usuario lo pide.

---

## 1. Abrir el panel (siempre lo primero)

Artifact privado de claude.ai:

> **https://claude.ai/code/artifact/284a3191-1e0d-4369-b695-8ab41de5a301**

Ábrelo en el navegador integrado (`preview_start {url}`). Si no hay navegador, da
el enlace y sigue: el panel es una comodidad visual, no una dependencia.

Luego, en la misma respuesta, lee la cola (§2) y resume: pendientes por prioridad,
bloqueadas esperando respuesta, y en-curso — señalando cualquier tarea en curso
**sin `sesion` declarada** (tarjeta fantasma: nadie está trabajando de verdad).

**Fuente del panel:** `panel-tareas/index.html` en `krugkrug/meta`. Editar el
archivo no actualiza el Artifact publicado: hay que republicarlo (herramienta
Artifact con la URL de arriba). Al tocar el archivo sube `PANEL_VERSION` — el
badge junto al título delata un panel desfasado.

---

## 2. Dónde viven las tareas

**Un solo archivo: `panel-tareas/tareas.json` en `krugkrug/meta`, rama `main`.**
Cubre todos los repositorios: el repo donde se trabaja es el campo `repo` de cada
tarea. Desde una sesión de Claude Code se lee y edita como archivo local (tras
`git pull`); el panel lo hace vía conector GitHub.

Campos: `prio` (alta/media/baja) · `semaforo` (verde/amarillo/rojo — **el
guardarraíl real**) · `estado` (pendiente/en-curso/bloqueada/hecha/descartada) ·
`modelo` (haiku/sonnet/opus — respétalo si puedes elegir) · `dependeDe` (id;
bloquea mientras esa tarea no esté hecha ni descartada; solo mismo repo) ·
`necesitaRespuesta` (bool) · `sesion` (`{id, donde, desde}` o null) · `notas`
(hilo de la tarea: `{quien, cuando, texto}`).

Detalle completo de campos y trampas: `panel-tareas/README.md`.

---

## 3. Sincronizar sesiones activas

`/tasks sync` da de alta en `tareas.json` las sesiones de Claude Code que
están trabajando de verdad pero no tienen tarea `en-curso` asociada. Solo
funciona desde Claude Code (`mcp__ccd_session_mgmt__list_sessions` no es un
conector de claude.ai, así que el panel no puede llamarlo). Protocolo completo:
`references/sincronizar-sesiones.md`.

## 4. Ejecutar la cola

Cuando el usuario diga "lanza las tareas" o similar, carga
`references/protocolo-cola.md` y síguelo. Resumen de una línea por regla:

1. `git pull` antes de nada; el archivo de main es la verdad.
2. Solo se ejecutan las `pendiente` + `semaforo:verde` + sin dependencia viva.
   Amarillo/rojo: pregunta y bloquea, sin tocar nada.
3. Al empezar una tarea, **rellena `sesion`** y pon `en-curso` — sin eso el panel
   enseña una tarjeta fantasma.
4. Entrega trunk-based: push directo a `main`, verificado, y solo entonces `hecha`.
5. Todo cambio de estado se anota en `notas` — es el registro de auditoría junto
   con `git log`.

**Quién ejecuta:** una routine de Claude Code en la nube (existe y ha entregado
trabajo real) o esta misma sesión. GitHub Actions está descartado: el workflow
`tareas.yml` está `disabled_manually` en los repos y el token OAuth se rechaza —
historia completa en el README. **Poner una tarea en pendiente no lanza nada por
sí solo**: alguien tiene que abrir el archivo.

---

## Anti-patrones

- Marcar `hecha` sin push verificado en `main`.
- Ponerse a trabajar sin rellenar `sesion` (tarjeta fantasma).
- Bloquear sin poner `necesitaRespuesta` (la pregunta desaparece del radar).
- Tocar algo en amarillo o rojo sin respuesta explícita de Alfredo.
- Editar `tareas.json` sin `git pull` previo (pisas a la routine).
- Volver a preguntar lo que ya está contestado en `notas`.
- Usar los GitHub Issues como cola: eso murió el 29/07/2026.

---
name: boceto
description: Crea o itera un boceto visual — un HTML estático y autocontenido en meta/boceto-<slug>.html del repo activo, sin build, sin datos reales, sin tocar código de producto — para validar el enfoque de una pantalla o interacción antes de comprometer desarrollo. Úsala cuando Alfredo diga "haz un boceto de X", "boceta esto", "maqueta de la pantalla X", "quiero ver cómo quedaría X" o pida una idea visual antes de programarla. Cuando lo apruebe, el cierre de esta skill es dar de alta una tarea en claudedash que documenta qué construir y referencia el boceto — nunca abrir rama directamente. No confundir con `guardar-plan`, que archiva el plan textual de una sesión en krugkrug/meta: esta skill trabaja siempre en el repo del producto y produce un archivo HTML de maqueta, no una nota de plan.
---

# Boceto — maqueta visual, sin rama, hasta que se convierte en tarea

**Versión:** v1.0 · **Fecha:** 23/09/2026 · **Responsable:** Alfredo Sánchez-Bella Solís

Un boceto valida el **enfoque visual** antes de que exista una rama, un
worktree o una sesión de Orquesta. Vive fuera del ciclo normal de desarrollo
a propósito: es la forma más barata de equivocarse. Referencia completa del
porqué: `PRINCIPIOS_DE_TRABAJO.md` §4 (semáforo, excepción "boceto sin
rama") del repo donde se trabaja — no todos los repos la tienen escrita
todavía; si falta, aplícala igual y ofrécete a documentarla ahí.

## Qué es / qué no es

- **Es:** un `.html` autocontenido — CSS y JS inline o embebidos, sin build,
  sin llamadas a APIs ni datos reales. Puede copiar clases/estilos del
  producto real para que la piel coincida (reutiliza antes de crear).
- **No es:** código de producto. No importa módulos de la app, no toca
  `src/`, no persiste nada, no es funcional más allá de lo necesario para
  que Alfredo vea cómo quedaría.

## Dónde vive

Siempre en el repo del producto donde se está pensando la pantalla —
**nunca en `krugkrug/meta`** (eso es `guardar-plan`, y es texto, no HTML):

```
meta/boceto-<slug>.html
```

`slug` en kebab-case, corto (máx. ~5 palabras), describe el asunto — dará
nombre después al `<tipo>/<asunto>` de la rama si el boceto se aprueba.

## Ciclo de iteración

Mientras Alfredo pide ajustes sobre el mismo boceto, se sigue reescribiendo
el mismo archivo:

1. Escribe o edita `meta/boceto-<slug>.html`.
2. Enséñalo — Artifact, o `preview_start` abriendo el archivo directo, o el
   enlace de localhost si el boceto reutiliza el servidor del repo.
3. Commit **directo a `main`** del repo activo, sin rama ni PR — semáforo
   🟢, es la excepción explícita de `PRINCIPIOS_DE_TRABAJO.md` §4. Mensaje:
   `docs(boceto): <qué cambió>`. Hazlo y avisa después.
4. Repite mientras Alfredo pida cambios sobre el enfoque visual.

**Anti-patrón a evitar** (visto en los bocetos existentes de `alfplan`):
no dejes que el archivo derive en desarrollo real dentro del mismo commit —
si un mensaje de commit sobre un `boceto-*.html` empieza a sonar a
`feat:`/`fix:` de producto, es la señal de que tocó pasar al cierre (§
siguiente), no seguir iterando el archivo.

## Cierre — cuando Alfredo lo aprueba

No se abre rama, worktree ni sesión de Orquesta desde esta skill. El
resultado de un boceto aprobado es **una tarea en claudedash** que
documenta el trabajo real y referencia el boceto — la ejecuta más tarde la
cola normal (`tasks`/`taskrun`), que sí abrirá su propia rama cuando toque
(`PROCESO_DESARROLLO.md` §3).

1. Necesitas `CLAUDEDASH_PASSWORD` en el entorno (ver skill `tasks`
   §2) — si falta, dilo explícito en vez de intentarlo a ciegas.
2. Da de alta la tarea desde `krugkrug/meta`:

```bash
python3 panel-tareas/tarea.py nueva --json '{
  "titulo": "<qué construir, en una frase>",
  "descripcion": "Boceto aprobado en meta/boceto-<slug>.html (commit <sha o enlace GitHub>). <qué hay que construir, con el detalle suficiente para que quien lo ejecute no tenga que releer esta conversación: qué queda dentro, qué queda fuera, cualquier decisión ya tomada en el boceto>",
  "repo": "krugkrug/<repo>",
  "prio": "media",
  "semaforo": "verde",
  "estado": "backlog",
  "modelo": null,
  "dependeDe": null,
  "necesitaRespuesta": false,
  "sesion": null,
  "notas": []
}'
```

   - `estado` siempre `backlog` — nunca `pendiente`: una tarea nueva no se
     lanza sola (skill `tasks` §2), Alfredo la promueve a mano desde
     Planificación cuando le toque.
   - `prio` por defecto `media` si Alfredo no la ha dicho — es ajustable
     luego sin coste, no preguntes solo por esto.
   - `descripcion` es lo que sustituye a esta conversación cuando alguien
     (u otra sesión) ejecute la tarea: documenta bien, no la dejes en una
     frase vaga tipo "hacer el boceto de X".
3. Confirma con el id/título de la tarea nueva y el enlace al boceto —
   nunca marques nada como `hecha`: la tarea empieza su vida en `backlog`,
   el trabajo real todavía no ha empezado.

## Anti-patrones

- Poner código de producto o datos reales dentro de `meta/boceto-*.html`.
- Abrir rama, worktree o PR desde esta skill — el boceto se commitea
  directo a `main`; la tarea nace en `backlog`, no en una rama.
- Crear la tarea con `estado` distinto de `backlog`, o sin `descripcion`
  que referencie el boceto y documente el trabajo.
- Confundir esta skill con `guardar-plan` (esa es un plan textual en
  `krugkrug/meta`; esta es una maqueta HTML en el repo del producto).
- Iterar el boceto sin avisar del commit (sigue siendo 🟢, pero "avisa
  después" no es "no avises").

---
name: nota
description: Lee y escribe en el cuaderno de notas de Alfredo (home.sanchezbella.com/notas) desde cualquier repo o sesión de Claude, usando la clave de API. Úsala cuando Alfredo diga "/nota", "apunta esto en mis notas", "guarda en el cuaderno", "añade a la nota de X", "qué tengo apuntado de X" o "lee mi nota de X", y también para dejar una decisión, un aprendizaje o el resumen de una sesión donde él lo consultará. No sirve para borrar notas ni para editar «estructura» ni «archivo» (la API lo prohíbe con clave). No confundir con `guardar-plan` (archiva planes aprobados en claudeblmds/) ni con las notas de sesión de Claude Code.
---

# /nota — cuaderno de notas desde cualquier sesión (v1.0.0)

Las notas viven como `home/notas/<slug>.md` en `krugkrug/meta`. Esta skill las
lee y escribe por la API de la web de notas, así que **no hace falta tener `meta`
clonado** ni en el alcance de la sesión: basta la clave. Cada guardado es un
commit `notas(sesión): <slug>` en `meta`, visible en su historial.

## Requisitos (variables de entorno de la sesión)

- `HOME_NOTAS_API_KEY` — la clave (obligatoria). **Nunca** la imprimas, la
  copies a un archivo, la pongas en un commit ni la repitas en la conversación.
- `NOTAS_URL` — opcional; por defecto `https://home.sanchezbella.com/api/notas`.

Si falta la clave: dilo en una línea y remite a
`skills/productivity/alf-notas/PUESTA_EN_MARCHA.md` (en `krugkrug/meta`). No
intentes adivinarla ni pedírsela a Alfredo en el chat.

## Cómo se usa

Todo pasa por el script `scripts/nota.py` (junto a este archivo; solo Python
estándar). Ejecútalo con `python3 -I <ruta>/scripts/nota.py …`:

| Quiero… | Orden |
|---|---|
| Ver qué notas hay | `nota.py listar` |
| Leer una | `nota.py leer <slug>` |
| **Añadir** al final de una nota (lo habitual) | `nota.py anexar <slug> [--titulo T] < texto.md` |
| Crear o **sustituir** una nota entera | `nota.py guardar <slug> [--titulo T] < texto.md` |

- El texto se pasa por entrada estándar (heredoc o `< archivo`), así no hay
  que escapar comillas.
- `<slug>`: minúsculas, números y guiones; `/` para carpetas
  (`caza/esplegares`). Antes de crear una nota nueva, haz `listar` y
  comprueba que no existe ya una del mismo tema: **anexar a la existente
  gana a crear otra**.
- Con `anexar` el script relee y reintenta solo si alguien editó entre medias.
  Con `guardar` (sustituye todo) un conflicto sale con código 2: **relee la
  nota, integra los cambios de la otra persona y vuelve a guardar**; nunca
  fuerces ni sobrescribas a ciegas.

## Reglas de contenido

1. Lo que se apunta se entiende solo, sin conocer la sesión: qué se decidió,
   por qué y qué queda pendiente. Sin referencias del tipo «lo de antes» o
   «el punto 3».
2. Encabeza cada anexo con la fecha y el repo de origen, p. ej.
   `## 2026-10-07 · repo coriodash`, y escribe en Markdown plano (listas con
   `-`, dos espacios por nivel).
3. Datos y cifras: con su fuente, como en el resto de su trabajo.
4. Antes de guardar, enseña a Alfredo en una línea qué vas a escribir y dónde
   **solo si** el texto no es lo que él te dictó o pidió guardar. Si te dictó
   el texto, guarda y avisa después.
5. No guardes secretos (claves, contraseñas, tokens) ni datos personales de
   terceros que no vengan de él.

## Qué la API no permite con clave (diseñado así a propósito)

- Borrar notas (`403`). Si hay que borrar, lo hace Alfredo desde la web.
- Editar `estructura` y `archivo` (`403`): son notas con formato propio que
  organizan la home.
- Nombres reservados del sitio (`index`, `claude`, `tema`, `plantillas/…`…): `400`.

## Si algo falla

- `401`: clave mal escrita o sin configurar en el servidor (Vercel).
- «No llego a …»: en una sesión cloud, el dominio puede no estar permitido en
  la política de red del entorno. Díselo a Alfredo con ese texto; está
  explicado en `PUESTA_EN_MARCHA.md`.
- `409` repetido: edición simultánea; relee y reintenta una vez, y si persiste,
  cuéntaselo.

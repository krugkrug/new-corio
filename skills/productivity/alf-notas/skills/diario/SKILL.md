---
name: diario
description: Crea la entrada de diario de un sitio (el Prado, la casa nueva, el alquiler de verano…) en su nota del cuaderno y deja actualizado su «Recap», el resumen que mostrará la lista enlazada. Siempre enseña el borrador y espera el OK de Alfredo antes de guardar. Úsala cuando diga "/diario", "apunta en el diario del Prado", "añade esto al diario de X", "haz el recap de X", "actualiza el recap" o dicte lo que ha pasado hoy en uno de sus sitios. Para apuntes sueltos que no son un diario, usa `nota`.
---

# /diario — entrada del día + recap de un sitio (v1.0.0)

Cada sitio tiene **una nota** en el cuaderno (`home/notas/<slug>.md` en
`krugkrug/meta`) con dos secciones que esta skill mantiene:

- `## Recap`: el resumen vigente, de unas 8 viñetas. Es lo que enseña la lista
  de viajes enlazada a esa nota.
- `## Diario`: las entradas por fecha (`### AAAA-MM-DD · origen`), la más
  reciente primero.

Todo lo demás de la nota (fichas, tablas, otras secciones) **no se toca**.

## Sitios conocidos (a 2026-10-08; comprueba con `listar` si hay dudas)

| Lista de viajes | Nota (`slug`) |
|---|---|
| Norte — Prado (El Jaro, San Cipriano): la finca actual | `prado-jaro` |
| Norte — Casa nueva: el proyecto de casa o prado que busca | `proyectos/prado-casa` |
| Norte — Verano: la búsqueda de alquiler de agosto de 2027 | `cantabria-agosto-2027` |

Si Alfredo nombra otro sitio, busca su nota con
`python3 -I <ruta de la skill nota>/scripts/nota.py listar`. Si no existe, **no
la crees sin preguntar**: propón el slug y el título y espera el OK; luego
créala con `nota.py guardar`.

## Requisitos

Los mismos que `/nota`: variable `HOME_NOTAS_API_KEY` (nunca la imprimas ni la
copies) y, en sesión cloud, el dominio `home.sanchezbella.com` permitido. Si
falta algo, dilo en una línea y remite a
`skills/productivity/alf-notas/PUESTA_EN_MARCHA.md`.

Todo pasa por `scripts/diario.py` (junto a este archivo, solo Python estándar),
que usa el cliente de `/nota`: `python3 -I <ruta>/scripts/diario.py …`.

## Flujo (siempre en este orden)

1. **Localiza la nota** (tabla de arriba o `listar`).
2. **Lee el estado actual:** `diario.py ver <slug>` enseña el recap vigente, los
   títulos de las entradas y la última entrada, sin volcar la nota entera.
3. **Consigue el contenido del día.** Es lo que Alfredo dicta o pega; si lo
   trae desordenado, ordénalo. Si no ha dicho nada, pregunta en una línea:
   «¿Qué quieres que quede apuntado de hoy?». **No inventes nada** ni
   rellenes huecos: lo dudoso va marcado con ⚠️.
4. **Redacta el borrador** en dos archivos de la carpeta de trabajo de la
   sesión (no en el repo): la entrada y el recap nuevo.
5. **Compruébalo sin escribir:** `diario.py aplicar <slug> --entrada E.md
   --recap R.md --simular` valida el formato y muestra el cambio exacto.
6. **Enséñaselo a Alfredo** en el chat, en tres bloques cortos:
   1. La entrada del día, tal como quedará.
   2. El recap nuevo.
   3. «Qué cambia en el recap»: qué añade, qué quita (y por qué: porque se
      resolvió o porque ya no aplica) y qué modifica.
7. **Espera su OK.** Aunque el texto sea literal de su dictado, el recap es un
   resumen tuyo y se aprueba siempre. Si pide cambios, rehaz y vuelve al
   paso 5.
8. **Guarda:** el mismo comando sin `--simular`. Un solo commit
   `notas(sesión): <slug>` en `meta`. Avisa en una línea con el resultado.

Si Alfredo dice que solo quiere uno de los dos (solo entrada o solo recap),
pasa únicamente `--entrada` o `--recap`.

## Cómo se escribe cada parte

**Entrada** (`--entrada E.md`):
- Se entiende sola, sin conocer la sesión: qué pasó, qué se decidió, por qué y
  qué queda pendiente. Nada de «lo de antes» ni «el punto 3».
- No lleva título ni fecha: el script pone `### AAAA-MM-DD · repo <nombre>`
  (usa `--origen` si el origen es otro, y `--fecha` si no es hoy).
- Subtítulos solo desde `####` (el script rechaza `#`, `##` y `###`).
- Cifras con su base y fuente; dudas y riesgos con ⚠️; confianza si aplica.
- Sin secretos ni datos personales de terceros que no vengan de Alfredo.

**Recap** (`--recap R.md`), pensado para leerse de pie en el móvil:
- Máximo unas 8 viñetas de una o dos líneas, en este orden de interés:
  estado actual · decisiones tomadas · pendientes por orden · qué comprar o
  llevar · próxima acción.
- Parte del recap vigente y **cámbialo lo mínimo**: un pendiente no
  desaparece salvo que la entrada diga que se hizo o Alfredo lo indique.
- Sin títulos (el script los rechaza). No escribas la línea «Actualizado»: la
  pone el script.

## Lo que esta skill no hace

- No toca las listas ni sus casillas (compras, checks, aprendizajes, radares,
  inventario). Si de la entrada salen cosas para la lista, **proponlas aparte**
  al final del chat, como texto, y las añade Alfredo.
- No borra entradas ni edita las anteriores. Para corregir una, hazlo en una
  entrada nueva o con `/nota guardar` si Alfredo lo pide expresamente.
- No ofrece guardar sin OK.

## Si algo falla

- «No se puede aplicar: …»: formato (título prohibido, fecha mal escrita). Corrige y repite.
- Código 2 / conflicto: alguien editó la nota entre medias. El script ya
  reintenta solo tres veces; si persiste, díselo a Alfredo.
- `401`, «No llego a …»: igual que en `/nota`.

---
description: Revisa las ramas del repositorio actual, reconcilia lo terminado con main, publica y borra las ramas ya integradas — acotado a este repo
---

Carga la skill `cierre-repo` y ejecútala **solo sobre el repositorio actual**
(el que contiene el directorio de trabajo, vía `git rev-parse --show-toplevel`),
no sobre todos los repos de `Documents/GitHub`.

1. `fetch --all --prune` + `status` + `branch -vv` en este repo (Paso 0-1 de
   la skill). Esto es 🟢, hazlo sin preguntar.
2. Clasifica cada rama no-main de este repo: terminada, ya integrada/vacía, o
   dudosa (working tree sucio, posible abandono) — Paso 1 de la skill.
3. Muestra el plan (solo de este repo) y pide un solo OK antes de ejecutar
   merge/push/borrado. Para las dudosas, pregunta en concreto.
4. Tras el OK, ejecuta (Paso 3): push + PR, y borrado local+remoto de la rama
   solo cuando el PR esté `MERGED`. Conflicto → aborta y reporta.
5. Cierra con el resumen (Paso 4) de este repo: qué se publicó, qué se
   borró, qué queda pendiente y por qué.

Según `$ARGUMENTS`:

- vacío → repasa el repo actual completo.
- `dry` / `solo plan` → hace los pasos 1-3 y se para ahí, sin pedir OK para
  ejecutar.

---
description: Revisa las ramas de todos tus repos, reconcilia lo terminado con main, publica y borra las ramas ya integradas
---

Carga la skill `cierre-desarrollos` y ejecútala sobre todos los repos con
`.git` bajo `C:\Users\alfre\Documents\GitHub\`.

1. `fetch --all --prune` + `status` + `branch -vv` en cada repo (Paso 0-1 de
   la skill). Esto es 🟢, hazlo sin preguntar.
2. Clasifica cada rama no-main: terminada (fusionar+publicar+borrar), ya
   integrada/vacía (borrar sin merge), o dudosa (working tree sucio, posible
   abandono) — Paso 1 de la skill.
3. Muestra el plan completo (repo por repo) y pide un solo OK antes de
   ejecutar nada de merge/push/borrado. Para las dudosas, pregunta en
   concreto qué hacer.
4. Tras el OK, ejecuta repo a repo (Paso 3): merge `--no-ff` a main, push a
   `origin/main`, borrado local+remoto de la rama — solo tras confirmar el
   push. Conflicto → aborta y reporta, no lo resuelvas a ciegas.
5. Cierra con el resumen (Paso 4): qué se publicó, qué se borró, qué queda
   pendiente y por qué.

Según `$ARGUMENTS`:

- vacío → repasa todos los repos.
- un nombre de repo (p. ej. `alfbank`) → limita la rutina a ese repo.
- `dry` / `solo plan` → hace los pasos 1-3 y se para ahí, sin pedir OK para
  ejecutar (útil para ver el estado sin intención de tocar nada todavía).

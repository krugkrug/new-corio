---
name: cierre-repo
description: Igual que "cierre-desarrollos" pero acotado al repositorio actual (el del directorio de trabajo), no a todos los repos de Documents/GitHub. Detecta ramas con desarrollo terminado, las reconcilia con main, publica y borra la rama. Úsala cuando el usuario diga "/cierrerepo", "cierra este repo", "cierra el repo actual", "limpia las ramas de este repo" o pida una higiene de ramas acotada a un solo repo.
---

# Cierre de repo — higiene de ramas de un solo repositorio

**Versión:** v1.0 (23/09/2026) · **Responsable:** Alfredo Sánchez-Bella Solís

Esta skill es **la misma rutina que `cierre-desarrollos`** (mismo modelo,
mismo semáforo, mismos guardarraíles: ver esa skill para el detalle completo
de cada paso) pero con el alcance fijado al **repositorio actual** en vez de
recorrer todos los repos bajo `~/Documents/GitHub/`. Úsala cuando Alfredo
quiera cerrar solo el repo en el que está trabajando, sin tocar los demás.

**Semáforo de control** (de `CLAUDE.md`): fetch/listar es 🟢 (hazlo sin
preguntar). Mergear/abrir PR, publicar y borrar rama es 🟡 — junta todo en un
plan y pide **un solo OK** antes de ejecutar, salvo que Alfredo ya haya dicho
"hazlo todo". Nunca fuerces un merge con conflictos ni un push --force: eso
es 🔴, se para y se pregunta.

## 0. Alcance — un único repo

No recorras `~/Documents/GitHub/`. El repo es el que contiene el directorio
de trabajo actual:

```bash
git rev-parse --show-toplevel   # raíz del repo actual
```

Si el directorio actual es un worktree (`<repo>-wt-<asunto>`), usa ese mismo
worktree — no saltes al checkout principal del repo. Si el directorio actual
no está dentro de ningún repo git, dilo y pregunta a qué repo se refiere
Alfredo (no asumas uno de la lista de `PROCESO_DESARROLLO.md` §2).

```bash
git fetch --all --prune
git status -s
git branch -vv
```

## 1. Clasifica cada rama distinta de main/master

Idéntico al paso 1 de `cierre-desarrollos`:

- **Working tree sucio en esa rama** → no la toques, repórtalo aparte.
- **Sin commits por delante de `origin/main`** → candidata a borrado directo.
- **Con commits por delante y working tree limpio** → candidata a "terminada":
  revisa `git log -1` y `git diff origin/main...<rama> --stat`. Ramas
  `claude/*` sin actividad reciente (>7 días): sospechosas de abandono,
  pregunta.

## 2. Construye el plan y muéstralo

Mismos cuatro estados que `cierre-desarrollos` §7.1 (fusionada, viva,
huérfana, sucia), pero solo para las ramas de este repo. Pide **un solo OK**
para el conjunto (o confirmaciones puntuales para huérfanas y sucias).

## 3. Ejecuta, en este repo

**No fusiona nada a mano.** Todo entra por PR; `auto-merge.yml` lo cierra con
el CI en verde. Abrir el PR es fusionar — solo con el OK de Alfredo para esa
rama:

```bash
git push -u origin <rama>
gh pr create --repo <owner/repo-actual> --base main --head <rama>
```

Borra la rama —local y remota— solo cuando esté fusionada de verdad:

```bash
git branch -d <rama>          # -d, nunca -D
git push origin --delete <rama>
git worktree remove <ruta>    # si tenía worktree propio
```

Publica y purga el estado de **este repo** en el panel:

```bash
python3 panel-tareas/orquesta.py autodetectar --repo <ruta-de-este-repo>
python3 panel-tareas/orquesta.py purgar --repo <ruta-de-este-repo>
```

## 4. Resumen final

Qué se fusionó/publicó, qué rama se borró, qué queda pendiente en **este
repo** y por qué. No lo cierres como "hecho" si queda algo bloqueado.

## Guardarraíles (no negociables)

Los mismos que `cierre-desarrollos`:

- Nunca borras una rama con working tree sucio sin confirmación.
- Nunca `--force` en push, `--no-verify` en hooks, ni `branch -D`.
- Nunca borras una rama antes de confirmar que su trabajo está en `origin/main`.
- Nunca borras una rama huérfana (commits sin PR) sin respuesta explícita.
- Nunca abres un PR por tu cuenta — lo pide Alfredo, rama a rama.
- Ramas `claude/*` inactivas: se preguntan, no se asumen terminadas.

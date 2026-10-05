---
name: cierre-desarrollos
description: Revisa todos tus repositorios locales (Documents/GitHub), detecta ramas con desarrollo terminado, las reconcilia con main, publica y borra la rama. Úsala cuando el usuario diga "/cierre", "cierra los desarrollos", "reconcilia las ramas", "limpia las ramas", "publica lo terminado" o pida una pasada de higiene de ramas sobre sus repos — aunque no mencione la palabra "rutina".
---

# Cierre de desarrollos — rutina de higiene de ramas

**Versión:** v1.2 (29/09/2026) · **Responsable:** Alfredo Sánchez-Bella Solís
**Modelo:** trabajo en solo, pero **todo entra por PR**: `main` no se toca a mano y
`auto-merge.yml` fusiona el PR en cuanto el CI se pone verde (ver
`PROCESO_DESARROLLO.md` §3 y §7). Esta rutina **clasifica y limpia**: ordena las
ramas en los cuatro estados (viva · fusionada · huérfana · sucia), borra las
fusionadas, y deja a Alfredo lo que hay que decidir. El estado vivo se ve en la
vista **Orquesta** del panel (`panel-tareas/orquesta.py autodetectar`).
> v1.0 decía «trunk-based, push directo a `main`, sin PR». Era falso desde hacía
> meses: los últimos 30 merges de `meta` y todos los de `alfplan` son PR.

**Semáforo de control** (de `CLAUDE.md`): fetch/listar es 🟢 (hazlo sin
preguntar). Mergear, publicar y borrar rama es 🟡 (ambiguo/caro si algo no
está claramente terminado) — **por defecto, junta todo en un plan y pide UN
OK antes de ejecutar**, salvo que el usuario ya haya dicho "hazlo todo" o
equivalente. Nunca fuerces un merge con conflictos ni un push --force: eso es
🔴, se para y se pregunta.

---

## 0. Alcance

Repos: todos los subdirectorios con `.git` bajo `~/Documents/GitHub/` (los 8 de
`PROCESO_DESARROLLO.md` §2 — descúbrelos dinámicamente, no hardcodees la lista).
**Ojo con los worktrees**: `~/Documents/GitHub/<repo>-wt-<asunto>` es un working
directory más del mismo repo, no un repo aparte; `git worktree list` los enumera
sin duplicar el análisis.

Para cada repo:

```bash
git -C <repo> fetch --all --prune
git -C <repo> status -s
git -C <repo> branch -vv
```

## 1. Clasifica cada rama distinta de main/master

Por cada rama local que no sea `main`/`master`:

- **Working tree sucio en esa rama** → no la toques. Repórtalo aparte (no es
  "desarrollo terminado", es trabajo a medias). No adivines si el usuario
  quiere commitear eso — pregúntale.
- **Sin commits por delante de `origin/main`** (ya fusionada o vacía) → rama
  candidata a borrado directo, sin merge (ya no aporta nada).
- **Con commits por delante de `origin/main` y working tree limpio** →
  candidata a "terminada": mira el último commit (`git log -1`) y el diff
  resumido (`git diff origin/main...<rama> --stat`) para decidir si de verdad
  parece cerrada (no un WIP a medio hacer, no un experimento abandonado).
  Ramas `claude/*` sin actividad reciente (>7 días) y sin que el usuario las
  mencione: trátalas como sospechosas de abandono, pregunta en vez de asumir
  que están "terminadas".

No hay forma de saber con certeza desde el código si algo está "terminado" —
**no lo fuerces**. Si tienes duda razonable, esa rama va a la lista de
preguntas, no a la de ejecución automática.

## 2. Construye el plan y muéstralo

Antes de tocar nada, resume por repo, con los cuatro estados de
`PROCESO_DESARROLLO.md` §7.1:

- **fusionadas** (0 commits fuera de `origin/main`) → borrar, local y remota. Es
  lo único que esta rutina hace sola.
- **vivas** con PR abierto → se dejan; solo se reportan si llevan más de una semana.
- **huérfanas** (commits propios y ningún PR) → **pregunta concreta por cada una**:
  ¿abrir PR, archivar con tag o descartar (§7.1)? Nunca se borra trabajo sin PR sin
  respuesta explícita.
- **sucias** (working tree con cambios) → no se tocan; se reportan.

Pide **un solo OK** para el conjunto (o confirmaciones puntuales para huérfanas y
sucias). No ejecutes borrados sin ese OK.

## 3. Ejecuta, repo a repo

**Esta rutina no fusiona nada.** `main` no se toca a mano: lo que entra, entra por
PR, y `auto-merge.yml` lo cierra con el CI en verde (`PROCESO_DESARROLLO.md` §3).
Por eso **abrir el PR es fusionar** — y por eso solo se abre con el OK de Alfredo
para esa rama en concreto:

```bash
git -C <repo> push -u origin <rama>
gh pr create --repo <owner/repo> --base main --head <rama>
```

- Si hay hooks pre-commit locales (prettier/eslint/gitleaks, per
  `WEBAPP_GUARDRAILS_DEVOPS.md` §0.1 nota v1.3), déjalos correr — no uses
  `--no-verify`.
- Si el CI del PR se pone rojo, el PR se queda abierto y la rama sigue **viva**:
  se reporta, no se fuerza.

Borra la rama —local y remota— cuando esté **fusionada de verdad** (su PR en
estado `MERGED`, o 0 commits fuera de `origin/main`), nunca antes:

```bash
git -C <repo> branch -d <rama>          # -d, nunca -D: se niega si queda algo sin fusionar
git -C <repo> push origin --delete <rama>
git -C <repo> worktree remove <ruta>    # si esa rama tenía worktree propio
```

Publica el estado resultante en el panel para que se vea desde cualquier sesión, y
**purga lo que acabas de borrar** — si no, el panel sigue enseñando ramas muertas:

```bash
python3 ~/Documents/GitHub/meta/panel-tareas/orquesta.py autodetectar --repo <ruta>   # las que siguen vivas
python3 ~/Documents/GitHub/meta/panel-tareas/orquesta.py purgar --repo <ruta>          # quita las que ya no están
```

## 4. Resumen final

Por cada repo: qué se fusionó y publicó, qué rama se borró, qué quedó
pendiente (dudosas sin resolver, conflictos, working trees sucios) y por qué.
No cierres la rutina como "hecho" si queda algo bloqueado — repórtalo
explícitamente, igual que hace `protocolo-cola.md` en `alf-tasks` con las
tareas bloqueadas.

## 5. Aprendizaje continuo — qué te llevas de esta pasada

Antes de dar la rutina por cerrada, una pausa breve para convertir fricción
real en mejora de proceso — no es una retro obligatoria de diez puntos, es
capturar lo que de verdad habría ahorrado tiempo si ya estuviera resuelto.

1. **Revisa con ojo crítico lo que acabas de ver en los pasos 1-3**, buscando
   señales concretas, no genéricas:
   - Ramas que cambiaron solas, o commits que aterrizaron en la rama
     equivocada sin que nadie lo pidiera — señal de que falta un
     guardarraíl explícito de "comprobar `git branch --show-current` antes
     de cada commit" en la skill que estabas usando en ese momento.
   - Commits duplicados por `cherry-pick` (mismo `patch-id`, SHA distinto)
     — normalmente es el síntoma del punto anterior, no un caso aislado.
   - Ramas huérfanas o `claude/*` abandonadas que se repiten en el mismo
     repo — puede ser un patrón de proceso, no mala suerte puntual.
   - Cualquier paso que tuviste que resolver "a mano" porque un script o
     skill no lo cubría bien (interfaz inconsistente entre comandos,
     flag que espera una cosa en un sitio y otra en otro, mensaje de error
     que no decía lo que de verdad pasaba).
2. **Si algo se repite o costó tiempo de verdad**, no te lo guardes: da de
   alta una tarea en `backlog` con `python3 ~/Documents/GitHub/meta/panel-tareas/tarea.py nueva` — mismo
   criterio INVEST que `refinar.md`: título claro, descripción con el
   problema concreto observado (no una queja genérica), repo, semáforo.
3. **No inventes aprendizajes por rellenar el paso.** Si la pasada fue
   limpia y sin fricción real, dilo en una frase ("sin aprendizajes nuevos
   esta vez") y sigue — mismo espíritu que el guardarraíl de
   `/divergencia` contra forzar variedad donde no la hay.
4. Menciona en el resumen final (paso 4) qué tarea(s), si las hay, se
   dieron de alta por este paso — o que no hizo falta ninguna.

Este paso **no bloquea el cierre**: es el último, no una condición previa.

## Guardarraíles (no negociables)

- Nunca borras una rama con working tree sucio sin que el usuario lo confirme antes.
- Nunca `--force` en push, `--no-verify` en hooks, ni `branch -D`.
- Nunca borras una rama antes de confirmar que su trabajo está en `origin/main`.
- **Nunca borras una rama huérfana** (con commits y sin PR) sin respuesta explícita:
  es trabajo que se pierde.
- **Nunca abres un PR por tu cuenta** — abrirlo es fusionar. Lo pide Alfredo, rama
  a rama.
- Ramas `claude/*` inactivas: se preguntan, no se asumen terminadas.
- El paso 5 no inventa aprendizajes genéricos ni abre una tarea por cada nota —
  solo lo que se repite o costó tiempo real, y solo si hay algo que decir.

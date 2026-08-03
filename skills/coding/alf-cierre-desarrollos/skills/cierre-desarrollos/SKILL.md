---
name: cierre-desarrollos
description: Revisa todos tus repositorios locales (Documents/GitHub), detecta ramas con desarrollo terminado, las reconcilia con main, publica y borra la rama. Úsala cuando el usuario diga "/cierre", "cierra los desarrollos", "reconcilia las ramas", "limpia las ramas", "publica lo terminado" o pida una pasada de higiene de ramas sobre sus repos — aunque no mencione la palabra "rutina".
---

# Cierre de desarrollos — rutina de higiene de ramas

**Versión:** v1.0 · **Responsable:** Alfredo Sánchez-Bella Solís
**Modelo:** trabajo en SOLO — trunk-based, push directo a `main`, sin PR (ver
`WEBAPP_GUARDRAILS_DEVOPS.md` v1.3 y `CLAUDE.md`: "no busques plantilla de PR,
suelo trabajar solo"). Esta rutina hace en local + `main` lo que en un equipo
haría un PR: revisar, integrar, publicar, limpiar.

**Semáforo de control** (de `CLAUDE.md`): fetch/listar es 🟢 (hazlo sin
preguntar). Mergear, publicar y borrar rama es 🟡 (ambiguo/caro si algo no
está claramente terminado) — **por defecto, junta todo en un plan y pide UN
OK antes de ejecutar**, salvo que el usuario ya haya dicho "hazlo todo" o
equivalente. Nunca fuerces un merge con conflictos ni un push --force: eso es
🔴, se para y se pregunta.

---

## 0. Alcance

Repos: todos los subdirectorios con `.git` bajo `C:\Users\alfre\Documents\GitHub\`
(hoy: alfbank, alfplan, coriodash, evolog, gt, meta, new-corio, news, ratioc —
pero descúbrelos dinámicamente, no hardcodees la lista, van a cambiar).

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

Antes de tocar nada, resume por repo:

- ramas a **fusionar + publicar + borrar** (terminadas, claras)
- ramas a **borrar sin merge** (ya integradas o vacías)
- ramas **dudosas** (working tree sucio, o abandono probable) → pregunta
  concreta por cada una, no un genérico "¿qué hago con esto?"

Pide **un solo OK** para el conjunto del plan (o confirmaciones puntuales para
las dudosas). No ejecutes fusiones/push/borrados sin ese OK.

## 3. Ejecuta, repo a repo

Por cada rama aprobada para fusionar:

```bash
git -C <repo> checkout main
git -C <repo> pull --rebase origin main
git -C <repo> merge --no-ff <rama> -m "merge: <rama>"
```

- **Conflicto** → aborta el merge (`git merge --abort`), repórtalo con el
  archivo/hunk en conflicto, no lo resuelvas a ciegas. Queda 🔴: se para y se
  pregunta.
- Si hay hooks pre-commit locales (prettier/eslint/gitleaks, per
  `WEBAPP_GUARDRAILS_DEVOPS.md` §0.1 nota v1.3), déjalos correr — no uses
  `--no-verify`. Si el merge commit dispara el hook y falla, no lo saltes:
  corrige y vuelve a intentar.

Publica:

```bash
git -C <repo> push origin main
```

Borra la rama, local y remota, **solo tras confirmar que el push a main tuvo
éxito**:

```bash
git -C <repo> branch -d <rama>
git -C <repo> push origin --delete <rama>
```

Para las ramas "borrar sin merge" (ya integradas / vacías), salta el merge y
ve directo al borrado local + remoto.

## 4. Resumen final

Por cada repo: qué se fusionó y publicó, qué rama se borró, qué quedó
pendiente (dudosas sin resolver, conflictos, working trees sucios) y por qué.
No cierres la rutina como "hecho" si queda algo bloqueado — repórtalo
explícitamente, igual que hace `protocolo-cola.md` en `alf-tasks` con las
tareas bloqueadas.

## Guardarraíles (no negociables)

- Nunca merges/borras una rama con working tree sucio sin que el usuario lo
  confirme antes.
- Nunca `--force` en push ni `--no-verify` en commits/hooks.
- Nunca borras una rama antes de confirmar que el merge llegó a `origin/main`
  (push exitoso).
- Nunca resuelves un conflicto de merge por tu cuenta — se para y se pregunta.
- Ramas `claude/*` inactivas: se preguntan, no se asumen terminadas.

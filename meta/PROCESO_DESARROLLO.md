# Proceso de desarrollo — ecosistema krugkrug

> Cómo se construye, verifica, fusiona, despliega y respalda el código de los
> proyectos personales. Documenta el sistema **realmente desplegado y
> verificado** a 13/07/2026 (última actualización: 2026-09-07 — regla de la
> rama `meta-sync` frente a Vercel, §2). Complementa `WEBAPP_GUARDRAILS_DEVOPS.md`
> (el porqué) describiendo el cómo concreto.

---

## 1. Vista general

```
rama claude/*  ──PR──►  auto-merge.yml ──────────────────────►  main  ──►  Vercel (producción)
                          │ 1. checks Node (si hay lockfile)
                          │ 2. gitleaks sobre el diff del PR
                          │ 3. gh pr merge (idempotente)
                          └─ si algo falla: el PR queda abierto y NO se fusiona
```

- **Todo cambio entra por PR**; nadie hace push directo a `main` (única
  excepción: el bot de `news.yml`, ver §6).
- **El merge es automático pero condicionado**: solo si los checks pasan.
  Es la regla "merge solo con CI en verde" ejecutada por máquina, no por
  disciplina.
- **`main` = producción**: la integración Git de Vercel despliega cada push a
  `main` de los proyectos con dominio (`*.sanchezbella.com`).

## 2. Repos y despliegue

| Repo | Tipo | Producción | Auth |
|---|---|---|---|
| `meta` (carpeta `home/`) | estático + API | home.sanchezbella.com | **servidor**: `HOME_PASSWORD` env + cookie HMAC (`HOME_SESSION_SECRET`, 7 días). SSO de Vercel solo en previews y `*.vercel.app` (`all_except_custom_domains`, para poder instalar la PWA en Android). Excepción: `api/widget*.ts` sin sesión, a propósito |
| `alfbank` | Node (Vite+Express) | alfbank.sanchezbella.com | **servidor**: `APP_PASSWORD` env + cookie HMAC + rate-limit |
| `coriodash` | Node (Vite+Express) | coriodash.sanchezbella.com | **servidor**: mismo patrón que alfbank |
| `prado` | Node (Vite, estático) | prado.sanchezbella.com | candado cliente (`VITE_APP_PASSWORD` env de build) |
| `ratioc` | estático | ratioc.sanchezbella.com | sin candado (mockup) |
| `gt` | estático (+ API blob) | gtdash.sanchezbella.com | candado cliente (hash SHA-256) |
| `news` | Python + estático | news.sanchezbella.com | `EDIT_SECRET` env para guardar |
| `alfplan` | estático + API (Vercel Blob) | alfplan.sanchezbella.com | **SSO de Vercel** en todos los despliegues, incluido el dominio de producción y `/api/*` (comprobado en Vercel el 30/09/2026). Sin candado cliente (`ALFPLAN_AUTH_SECRET` vacío) ni auth de servidor: una sola capa. Pendiente de decidir pasar a contraseña de servidor como `home` |

El repo `home` original está **anulado** (fusionado en `meta/home/`; su README
redirige allí).

### La rama `meta-sync` no despliega

`sync-a-repos.yml` (en `meta`) propaga el set compartido al resto de repos por
una rama fija, `meta-sync`, con un PR que se fusiona solo. Dos reglas, ambas
por cómo trata Vercel esa rama:

1. **El autor del commit tiene que ser miembro del equipo de Vercel.** El
   equipo (`Perso`, plan Pro) marca `BLOCKED` todo despliegue cuyo autor de
   git no resuelva a un miembro. Con el email inventado
   `meta-sync@users.noreply.github.com` el autor era la cuenta inexistente
   `meta-sync`, así que cada sync dejaba una preview bloqueada —con su
   aviso— en cada repo conectado. **Producción nunca se vio afectada**: el
   merge a `main` lo firma `krugkrug` y ese despliegue siempre salió verde.
   El workflow usa ya `alfredo@sanchezbella.com` como email de autor.
2. **Aun así, esa preview no debe construirse.** Lo que se sincroniza
   (`CLAUDE.md`, `skills/`, workflows, `.gitleaks.toml`, docs en `meta/`) no
   entra en lo que se compila ni en lo que se sirve, así que construirla es
   tiempo de build tirado. El sync escribe
   `git.deploymentEnabled["meta-sync"]: false` en el `vercel.json` de cada
   repo destino, **fusionando** esa clave con `jq` y sin sobrescribir el
   fichero (cada repo tiene sus propios `rewrites` y funciones). Si un repo
   no tiene `vercel.json`, se crea uno mínimo con solo esa clave.

## 3. Flujo de un cambio

> **23/09/2026 — el PR ya no es automático.** `auto-merge.yml` fusiona solo en cuanto el CI
> se pone verde (§4), así que **abrir el PR es fusionar**. Por eso, desde esta fecha, una
> sesión de Claude Code **no abre PR por su cuenta**: trabaja en su rama, commitea, deja el
> preview local levantado y **espera a que Alfredo lo pida**. Revisar en local sustituye a
> revisar el PR. Al entregar se da siempre el enlace `http://localhost:<puerto>` (en alfplan,
> `node script/local-server.mjs --datos demo` sirve la semilla que cubre todos los casos, sin
> tocar los datos reales).
>
> **23/09/2026 (2) — la rama es de la sesión, no del requerimiento.** Hasta ahora cada
> requerimiento abría su propia rama; si una sesión resolvía tres tareas del mismo repo,
> dejaba tres ramas sueltas esperando revisión, y revisar en local dejó de sustituir a
> revisar el PR (párrafo de arriba) para pasar a ser tres revisiones. Por defecto **una
> sesión usa una única rama por repo durante toda su vida**, aunque resuelva varios
> requerimientos o lance varias rondas de `/tasks taskrun`: la primera vez que toca ese
> repo crea `<tipo>/<asunto>` del primer requerimiento; las siguientes reutilizan esa
> misma rama (`git checkout <rama>` en vez de `-b`), apilando un commit por requerimiento.
> Sigue sin fusionarse hasta que Alfredo la revisa en local, acumule uno o varios
> requerimientos.

1. **Rama** corta por sesión (`feat/…`, `fix/…`, `docs/…`, `chore/…` — el prefijo lo pone
   el primer requerimiento que la sesión resuelve en ese repo), nunca sobre `main`.
   **Una rama = una sesión = un worktree propio** (`../<repo>-wt-<asunto>`) por defecto —
   ya no una rama por requerimiento (ver el aviso de arriba): dos sesiones no comparten
   working directory ni rama, pero una misma sesión sí comparte su rama entre todos los
   requerimientos que resuelva en ese repo. La sesión se da de alta en la vista **Orquesta**
   del panel con `panel-tareas/orquesta.py autodetectar --repo <ruta>` la primera vez, y
   antes de crear una rama nueva comprueba con `orquesta.py listar --repo <owner/repo>`
   si ya tiene una viva ahí (mismo `sesion.id`) para reutilizarla.
2. **Hooks locales** (primera línea, no la red de seguridad): Husky en los
   Node (`prettier` + `eslint` + `gitleaks` sobre lo staged) y `.githooks` en
   los estáticos (requiere `git config core.hooksPath .githooks` una vez).
   Plantillas fuente, con el paso a paso completo: `plantillas/SETUP-completo.md`
   (Node) y `plantillas/SETUP-simplificado.md` (estáticos) — cada repo copia la
   suya como `SETUP.md`.
3. **PR contra `main`, cuando Alfredo lo pide** (ver el aviso de arriba). Al abrirse (o
   reabrirse, salir de borrador, o **recibir un push** — `synchronize`), se dispara
   `auto-merge.yml`.
4. **Checks** (ver §4). Si fallan, el PR queda abierto con el run en rojo;
   se arregla y el propio push re-lanza todo.
5. **Merge automático** por el bot → Vercel despliega `main`.

## 4. CI: `auto-merge.yml` (idéntico byte a byte en los 8 repos)

Archivo único compartido; cualquier mejora se replica a los 8 para que no
haya deriva (verificable con `md5sum`).

- **Trigger**: `pull_request: [opened, reopened, ready_for_review, synchronize]`.
  `synchronize` cubre el caso "resolví un conflicto con un push": antes se
  quedaba parado y había que fusionar a mano.
- **Guard**: solo PRs a la rama por defecto, no borradores, autor
  OWNER/MEMBER/COLLABORATOR.
- **`concurrency`**: un push nuevo cancela la pasada anterior del mismo PR.
- **Checks Node** — solo si existe `package-lock.json` en la raíz (criterio:
  `npm ci` lo exige; `gt`/`news` tienen `package.json` de utilería sin
  lockfile y no deben ejecutar esto):
  `npm ci --ignore-scripts` → `check` (tsc) → `lint` (eslint, los *warnings*
  no bloquean, los *errors* sí) → `test` (vitest) → `build`. Todos con
  `--if-present`.
- **Escaneo de secretos**: gitleaks **v8.24.3 pineada** con checksum oficial
  verificado, **solo sobre los commits del PR** (`--log-opts base..head`) —
  el historial antiguo ya se auditó y bloquearía siempre. Respeta el
  `.gitleaks.toml` del repo si existe.
- **Merge idempotente**: `gh pr merge` probando `--merge/--squash/--rebase`
  con 6 reintentos; tras cada fallo comprueba si el PR ya está `MERGED`
  (la API puede fusionar y aun así devolver 502/"already in progress") para
  no pintar en rojo un merge que sí ocurrió.

**Por qué los checks viven dentro del job de merge**: los repos son privados
en plan Free → no hay branch protection / required checks → `gh pr merge
--auto` no serviría. La única forma de que los checks bloqueen es ejecutarlos
antes del `gh pr merge` en el mismo job.

**Validación realizada**: PR de humo con error de lint → bloqueado en checks;
PR de humo con credencial AWS falsa → bloqueado exactamente en gitleaks con
el merge saltado.

## 5. Secretos y contraseñas

- **Regla**: ninguna credencial en el código. Env vars en Vercel
  (`APP_PASSWORD`, `SESSION_SECRET`, `EDIT_SECRET`, `VITE_APP_PASSWORD`…) y
  secrets de Actions para los backups.
- **Candados de cliente** (gt; en alfplan el código existe pero está vacío): son un *disuasorio*, no
  seguridad de servidor. El valor en el código es el **hash SHA-256** de la
  contraseña, nunca el texto plano (el código acepta ambos; se usa siempre el
  hash). Para calcularlo:
  ```bash
  node -e "crypto.subtle.digest('SHA-256',new TextEncoder().encode('TU_PASS')).then(b=>console.log([...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')))"
  ```
- **`.gitleaks.toml`** (solo en `gt`, `alfplan`, `meta`): allowlist de esos
  hashes públicos de cliente para que gitleaks no bloquee los PRs que tocan
  esas líneas. Cualquier otro hallazgo bloquea.
- **Datos sensibles de verdad** (alfbank, coriodash, home): auth de servidor —
  contraseña solo en env, cookie firmada HMAC-SHA256, comparación de tiempo
  constante, rate-limit de login, y en producción sin `APP_PASSWORD` la API
  se bloquea entera en vez de quedar abierta.

## 6. Backups (automáticos, en Actions de `alfbank`)

**Dónde vive hoy la base de datos de cada app** (revisado el 09/09/2026 — esto
cambia con las migraciones, y un backup que apunta a la fuente antigua copia
datos muertos sin dar ningún error):

| App | BD de producción | La respalda |
|---|---|---|
| alfbank | **Vercel Blob** (`data/<pestaña>.json`) | `backup-blob.yml` |
| alfplan | **Vercel Blob** (`alfplan/data.json`) | `backup-blob.yml` |
| coriodash | **Google Sheets** | `backup-sheet.yml` |

| Workflow | Cadencia | Qué respalda | Destino |
|---|---|---|---|
| `backup-blob.yml` | **diario** 03:41 UTC | Los stores de Vercel Blob — **centralizado**: `BACKUP_BLOB_TOKENS` lista los pares `nombre:token` | ZIP en carpeta Drive `Backup`, rotación de 30 copias por store |
| `backup-sheet.yml` | **diario** 03:17 UTC | Los Google Sheets que siguen siendo fuente — **centralizado**: `BACKUP_SHEET_IDS` | XLSX en carpeta Drive `Backup`, rotación de 30 copias por Sheet |
| `backup-repos.yml` | **semanal** dom 04:23 UTC | **Todos** los repos privados de la cuenta (los nuevos entran solos), como git bundle con historial completo | carpeta Drive dedicada, 8 copias por repo |

- **Vercel NO respalda el Blob**: borrar un blob o un store es permanente, sin
  versionado ni papelera. Por eso `backup-blob.yml` no es opcional. El snapshot
  que alfplan guarda en `alfplan/backups/` vive dentro del mismo store: no
  cubre perder el store, el token o la cuenta.
- Para añadir un proyecto nuevo, sin tocar código: si usa Blob, añadir un par
  `nombre:token` a `BACKUP_BLOB_TOKENS`; si usa Sheets, compartir el Sheet con
  la cuenta de servicio (lectura) y añadir su ID a `BACKUP_SHEET_IDS`.
- **Al migrar la fuente de datos de una app, mover su backup en el mismo PR.**
  Es el fallo silencioso más caro del sistema: la webapp funciona, el backup
  sale en verde todos los días, y lo que se copia es un snapshot congelado.
- Restauración documentada en `alfbank/BACKUP.md` (ZIP → volver a subir cada
  archivo con su pathname; XLSX → importar en Sheets; bundle →
  `git clone <fichero.bundle>`).
- **No replicar** estos workflows en otros repos: ya cubren todos los proyectos
  desde alfbank; duplicarlos crearía copias dobles.

**Workflow especial**: `news.yml` (repo `news`) genera el informe de
noticias 2×/día y hace **commit directo a `main`** con `[skip ci]` —
es el único push directo legítimo; Vercel redespliega al detectarlo.

## 7. Mantenimiento de ramas

- **`limpiar-ramas.yml`** (en los 8 repos): `workflow_dispatch` que borra la
  lista de ramas que se le pase, con el token de Actions (que sí tiene
  permiso de borrado; los clientes externos de este entorno no). Se niega a
  borrar la rama por defecto. Uso: Actions → *Borrar ramas (mantenimiento)*
  → Run workflow → pegar nombres separados por espacios.
- **Recomendado (pendiente de activar a mano)**: Settings → General →
  ☑ *Automatically delete head branches* en cada repo — GitHub borra la rama
  al fusionar el PR, server-side y reversible ("Restore branch" ~90 días).
  Con eso, `limpiar-ramas.yml` queda solo para casos raros.
- Nota técnica: un workflow `on: pull_request: [closed]` **no funcionaría**
  aquí — los merges los hace el bot con `GITHUB_TOKEN` y GitHub no encadena
  workflows desde eventos generados por ese token (anti-recursión).

### 7.1 Los cuatro estados de una rama

Toda rama que no sea `main` está en uno de estos cuatro, y cada uno tiene una acción. Es lo
que pinta la vista **Orquesta** del panel, con el color diciendo qué hacer:

| Estado | Cómo se detecta | Acción |
|---|---|---|
| **Viva** | PR abierto, o commits recientes y working tree limpio | Se deja. Si pasa de una semana, se revisa. |
| **Fusionada** | `git rev-list --count origin/main..<rama>` = 0 | Borrar ya, local y remota. |
| **Huérfana** | Commits propios y **ningún PR** | Decidir **con OK de Alfredo**: abrir PR, archivarla (`git tag archivo/<rama> <rama>` y luego borrar la rama: el trabajo queda guardado y sale de la lista) o descartarla (borrar). Nunca se borra sin esa respuesta explícita. Es el único estado que no se resuelve solo y el único que pierde trabajo. |
| **Sucia** | Working tree con cambios sin commitear | No se toca hasta que su dueño decida. |

Diagnóstico de un repo en un comando:

```bash
git fetch -q --prune
for b in $(git branch --format='%(refname:short)' | grep -v '^main$'); do
  printf '%-45s %s commits fuera de main\n' "$b" "$(git rev-list --count origin/main..$b)"
done; gh pr list --state open --json number,headRefName; git worktree list
```

`orquesta.py autodetectar --repo <ruta>` calcula ese estado solo y lo publica en el panel.

### 7.2 Desincronizaciones pendientes (23/09/2026)

Dos documentos siguen diciendo que aquí se trabaja sin PR, y no es cierto (los últimos 30
merges de `meta` y todos los de `alfplan` son PR):

- `skills/productivity/alf-tasks/.../protocolo-cola.md` — «Entrega trunk-based, nada de PRs
  ni ramas».
- `skills/coding/alf-cierre-desarrollos/.../SKILL.md` v1.0 — «push directo a `main`, sin PR».

**Manda este documento.** Además, el plugin **instalado** de `alf-tasks` está en v2.0
(almacén en el `tareas.json` de git, ya borrado) mientras la fuente va por v3.0 (claudedash):
hay que sincronizarlo antes de lanzar la cola.

## 8. Reglas de oro

1. **Merge solo con CI en verde** — lo ejecuta la máquina (§4), no la memoria.
2. **`main` es producción** — lo que se fusiona, se despliega.
3. **Cero secretos en el código** — env vars + gitleaks en el PR; en candados
   de cliente, siempre el hash.
4. **Un solo `auto-merge.yml`** — mejoras al proceso se replican a los 8
   repos; `md5sum` debe coincidir. Las **versiones de las acciones**
   (`actions/checkout`, `actions/setup-node`) van fijadas al major y se
   suben aquí, nunca repo a repo: tocarlas en un destino rompe ese
   `md5sum`. Al 10/09/2026, `@v6` — GitHub deprecó las que corrían sobre
   Node 20 (`@v4`), y el aviso salía en cada run sin romper nada, que es
   justo como se acumula esta deuda hasta que un día deja de arrancar.
   Ese mismo archivo trae un paso que solo actúa en `meta` (donde existe
   `.claude-plugin/marketplace.json`): falla el PR si la versión de un plugin en
   el catálogo no coincide con la de su `plugin.json`, porque entonces los
   equipos no reciben la actualización. En los demás repos se salta solo.
5. **Backup que no se restaura no es backup** — la restauración está
   documentada y los backups rotan solos. Y **un backup apuntando a la fuente
   antigua tampoco es backup**: al migrar de base de datos, el backup se
   migra en el mismo PR (§6).
6. **Ramas cortas, y borradas al fusionar** — activar auto-delete (§7). Una rama con
   trabajo y sin PR no se borra nunca sin preguntar (§7.1: se abre PR, se archiva con tag o se
   descarta, siempre con OK).
8. **El PR lo pide Alfredo, no la sesión** — abrir el PR es fusionar (§3, §4). Lo que la
   sesión entrega es la rama commiteada y el enlace del preview local.
7. **Indicador de versión obligatorio** — todo doc de control y todo header
   de webapp muestran `Última actualización: YYYY-MM-DD HH:MM — descripción`
   (ver `WEBAPP_GUARDRAILS_DEVOPS.md` §1.2).

## 9. Archivos de referencia

- `.github/workflows/auto-merge.yml` — CI + merge (los 8 repos)
- `.github/workflows/limpiar-ramas.yml` — limpieza de ramas (los 8 repos)
- `.github/pull_request_template.md` — plantilla de PR corta, para trabajo en solitario (los 8 repos)
- `meta/.github/workflows/sync-a-repos.yml` — propagación del set compartido
  por la rama `meta-sync` (ver §2: autor del commit y `vercel.json`)
- `plantillas/SETUP-completo.md` / `plantillas/SETUP-simplificado.md` — fuente
  del `SETUP.md` de cada repo, según lleve Node o sea estático
- `alfbank/.github/workflows/backup-blob.yml` + `backup-sheet.yml` +
  `backup-repos.yml` + `script/backup-comun.ts` + `BACKUP.md`
- `news/.github/workflows/news.yml` — generador del informe
- `gt|alfplan|meta:.gitleaks.toml` — allowlists de hashes de cliente
- `coriodash/docs/WEBAPP_GUARDRAILS_DEVOPS.md` — principios y prioridades
- `meta/PRINCIPIOS_DE_TRABAJO.md` — marco general de trabajo

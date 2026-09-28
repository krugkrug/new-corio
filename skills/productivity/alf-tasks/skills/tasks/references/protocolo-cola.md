# Protocolo de ejecución de la cola

Cárgalo solo cuando vayas a **ejecutar** tareas. Para abrir el panel y resumir no
hace falta. El almacén es el backend Blob de claudedash
(`home.sanchezbella.com/api/claudedash`) — desde el corte del 16/09/2026,
`panel-tareas/tareas.json` en git quedó congelado como snapshot histórico, ya
no es la fuente de verdad.

## Toda escritura va por `panel-tareas/tarea.py`

**No llames a `/api/claudedash` a mano (curl/Python ad-hoc) en ningún paso de
este documento.** Usa siempre:

```bash
python3 panel-tareas/tarea.py listar
python3 panel-tareas/tarea.py get <id>
python3 panel-tareas/tarea.py patch <id> --set '<json de campos a fusionar>' \
    [--nota "texto"] [--quien claude]
python3 panel-tareas/tarea.py nueva --json '<json de la tarea, sin id>'
python3 panel-tareas/tarea.py archivar [--estados hecha,descartada]
```

Necesita `CLAUDEDASH_PASSWORD` en el entorno (la contraseña de `home`; el script
hace login y cachea la sesión) — si no está, el propio script lo dice en vez de
fallar a ciegas.

Por qué es obligatorio y no una sugerencia: el 16/09/2026 un agente cerró la
tarea 14 volcando el array **entero** de `tareas.json` desde una copia que
llevaba 11 minutos sosteniendo en memoria (leída en el Paso 2.1, reescrita
entera en el Paso 2.6) — mientras tanto el panel dio de alta las tareas 15 y
16, que desaparecieron pisadas por ese commit. No fue un fallo de "faltó hacer
`git pull`": fue serializar una copia vieja del array completo en vez de
releer el estado justo antes de escribir. `tarea.py` lo hace estructuralmente
imposible: cada operación relee el documento del backend en el momento de
escribir, toca solo la tarea indicada (o añade una sola tarea nueva y sube
`siguienteId`), y manda `ifMatch` con lo que acaba de leer — si otra sesión
escribió entre medias, el backend responde 409 y el script relee y reaplica el
mismo cambio (hasta 5 intentos), nunca fuerza. Detalle y garantías completas en
la cabecera del propio script (`--help` o leer el docstring).

Si por lo que sea `tarea.py` no está disponible en el checkout (repo viejo sin
este archivo), no hay camino degradado seguro: el backend no acepta reescrituras
del array completo sin `ifMatch` calculado igual que hace el script. Actualiza
el checkout (`git pull`) en vez de reinventar el patrón a mano.

---

## Paso 0 — leer el estado fresco y sanear

```bash
python3 panel-tareas/tarea.py listar
```

Lo que devuelva es la verdad — no hace falta `git pull` para la cola (sí para
el repo de la tarea, en el Paso 2). Saneos baratos antes de decidir:

- **`en-curso` con `sesion` de otra sesión y sin actividad reciente** (mira
  `actualizada`; el umbral del panel es 15 min): sesión muerta. Antes de rehacer
  nada, comprueba con `git log --oneline -20 origin/main` **en el repo de la
  tarea** si el trabajo ya llegó; si llegó, salta a la entrega; si no, retómala
  (pon tu `sesion`).
- **`en-curso` sin `sesion`**: tarjeta fantasma. Igual que la anterior.
- **`dependeDe` apuntando a una tarea hecha o descartada**: ya no bloquea, se
  ejecuta con normalidad.

Anota en `notas` cualquier saneo que hagas.

## Paso 0.2 — reconciliar: cerrar lo que ya está en `main`

Desde que la entrega es por rama y **el PR lo pide Alfredo** (Paso 2.4), una
sesión ya no puede marcar `hecha` al terminar: su trabajo aún no está en `main`.
Sin este paso, esas tareas se quedan `en-curso` para siempre y la cola miente.

Por cada tarea `en-curso` que tenga rama apuntada (campo `rama`, o su fila en el
panel de Orquesta con `requerimiento` = ese id):

```bash
python3 panel-tareas/orquesta.py listar --repo <owner/repo>
gh pr list --repo <owner/repo> --head <rama> --state all --json number,state,mergedAt
```

| Lo que veas | Qué haces |
|---|---|
| PR `MERGED` | `tarea.py patch <id> --set '{"estado":"hecha","sesion":null}' --nota "PR #N fusionado en main."` y luego `orquesta.py purgar --repo <ruta>` |
| PR `OPEN` | Nada: el trabajo está hecho pero no entregado. Sigue `en-curso` — es correcto, no un fantasma |
| PR `CLOSED` sin fusionar | `bloqueada` + `necesitaRespuesta`: alguien lo descartó y la tarea no lo sabe |
| Sin PR y rama con commits | Huérfana. `bloqueada` con la pregunta: ¿abrir PR o descartar? |
| Sin PR y rama sin commits, trabajo en `main` | Se entregó por otra vía: `hecha`, anotando el commit |

**Es el único sitio donde una sesión puede poner `hecha` trabajo que no hizo
ella** — y puede porque no es un juicio: un PR fusionado es un hecho
comprobable. Lo corren `/tasks`, `/tasks taskrun` y `/orquesta` al empezar.

## Paso 0.5 — triaje del backlog

Antes de decidir por semáforo, procesa toda tarea con `estado: "backlog"`
(las crea el panel con "+ Nueva tarea": sin modelo ni fases, solo título,
descripción, prioridad y dependencia — `backlog` sustituyó a `sin-refinar`
desde el panel v14). Este paso reemplaza al humano eligiendo `modelo` a mano —
lo decide quien va a ejecutar, con el trabajo delante — y es más completo que
promover una tarea desde su propia tarjeta en el panel (columna Backlog del
Tablero desde v18): eso solo pide el modelo; esto además bloquea lo
insuficiente y descompone en fases. Si Alfredo ya promovió una tarea a mano
desde el panel, llega aquí como `pendiente` con modelo puesto y no pasa por
este paso — no hay que repetirlo.

1. **Si la descripción no basta** para ejecutarla sin supervisión (mismo
   criterio que el Paso 4 de `taskrun.md`): bloquéala igual que el Paso 1 de
   este documento — nota con la pregunta concreta, `estado: "bloqueada"`,
   `necesitaRespuesta: true`. No inventes alcance ni fases sobre una
   descripción insuficiente.
2. **Si basta y es una sola pieza de trabajo** (no hay pasos secuenciales
   claros ni mezcla de complejidad distinta): pásala directamente a
   `pendiente`, asignando:
   - `modelo`: `haiku` si es mecánica y bien acotada, `sonnet` por defecto,
     `opus` solo si es arquitectura o ambigüedad real.
   - `semaforo`: `verde` solo si es reversible y barata; si no, dilo en una
     nota y déjala `amarillo`/`rojo` con `necesitaRespuesta: true` — el
     triaje nunca se autoaprueba un amarillo o rojo.
3. **Si conviene dividirla en fases** (pasos secuenciales con criterio de
   éxito propio, o que mezclan niveles de complejidad que piden modelos
   distintos): crea una tarea nueva por fase, cada una con su propio
   `modelo` y `semaforo` (mismo criterio del punto 2), encadenadas con
   `dependeDe` a la fase anterior (la primera, sin dependencia). Marca la
   tarea original `estado: "hecha"` con una nota "Descompuesta en fases #X,
   #Y, #Z" y el porqué del troceo — no se ejecuta ella misma, sus fases sí.

**El troceo se PROPONE antes de escribirse.** Descomponer una tarea en cinco es
una decisión de alcance, y escribirla directa deja a Alfredo revisando cinco
tarjetas ya creadas en vez de una propuesta. Si vas a trocear, enseña primero la
lista —fase, criterio de éxito, modelo, dependencia— en la respuesta, y escríbela
cuando diga que sí. Los dos casos anteriores (bloquear por insuficiente, pasar a
`pendiente` tal cual) sí se escriben directos: no cambian el alcance de nada.

Mismo tope anti-bucle que el Paso 1: si ya se bloqueó 2 veces en triaje, no la
bloquees otra vez — decide con lo que hay y declara los supuestos por escrito.
Misma herramienta de escritura que todo lo demás: `tarea.py patch` para la
tarea original y sus cambios de campo, `tarea.py nueva` por cada fase nueva
que crees.

## Paso 1 — decidir por semáforo

| Situación | Qué haces |
|---|---|
| `pendiente` + `verde` + sin dependencia viva | Ejecutar (Paso 2) |
| `amarillo` o `rojo` | **No tocar nada.** Pregunta concreta en `notas`, `estado: bloqueada`, `necesitaRespuesta: true` |
| `bloqueada` + respuesta nueva de Alfredo en `notas` | Esa respuesta ES el OK, también en amarillo/rojo → ejecutar. Relee las notas enteras; no repreguntes lo contestado |
| `hecha` / `descartada` | Nada |

**Tope anti-bucle:** si la tarea ya se bloqueó 2 veces (cuéntalo en `notas`), no
puedes bloquearla otra vez: ejecuta lo que puedas, declara los supuestos por
escrito en `notas`, y entrega.

## Paso 2 — ejecutar y entregar

1. Marca el arranque con `tarea.py patch <id>`:

   ```bash
   python3 panel-tareas/tarea.py patch <id> --set \
     '{"estado":"en-curso","sesion":{"id":"<tu id>","donde":"<dónde corres>","desde":"<ISO 8601 UTC ahora>"}}'
   ```

   Es lo que el panel enseña como "quién está trabajando".

   **Antes de crear rama, comprueba si esta sesión ya tiene una en este repo**
   (`PROCESO_DESARROLLO.md` §3, 23/09/2026(2): la rama es de la sesión, no del
   requerimiento — si esta misma sesión ya resolvió otra tarea de este repo antes,
   o viene de otra ronda de `/tasks taskrun` dentro de la misma sesión, reutiliza
   esa rama en vez de abrir una nueva):

   ```bash
   python3 panel-tareas/orquesta.py listar --repo <owner/repo>
   ```

   Busca una fila con `sesion.id` igual al id de esta sesión y `estado` distinto
   de `fusionada`. Si existe, esa es tu rama para el Paso 4. Si no, esta es la
   primera vez que esta sesión toca este repo: en el Paso 4 nace `<tipo>/<asunto>`
   del requerimiento actual, y esa rama vale para todas las tareas de este repo
   que hagas el resto de la sesión.

   En cuanto crees o reutilices la rama (Paso 4), **enlázala con esta tarea** — si
   no, la cola y el panel de Orquesta son dos registros que nadie cruza, y el Paso
   0.2 no tiene por dónde cerrarla:

   ```bash
   python3 panel-tareas/orquesta.py autodetectar --repo . --tarea <id>
   python3 panel-tareas/tarea.py patch <id> --set '{"rama":"<la rama de la sesión, nueva o reutilizada>"}'
   ```

2. Trabaja en el repo que diga el campo `repo` (clónalo o entra en él; `git pull`
   primero). Si quien ejecuta esta tarea es un subagente lanzado por otra sesión
   (p. ej. `/tasks taskrun`), esa sesión ya lo lanzó con el modelo del campo
   `modelo` — no hay nada que hacer aquí con ese campo.
3. Antes de dar la tarea por cerrada, pasa QA barato sobre tu propio diff: carga
   la skill `code-review` (nivel `low` si la tarea es mecánica, `medium` si toca
   lógica) sobre los cambios sin commitear. Si hay hallazgos confirmados,
   arréglalos antes de seguir; si algo es dudoso o de diseño mayor, anótalo en
   `notas` en vez de bloquear la entrega por ello.
4. Entrega **en rama; el PR lo pide Alfredo** (23/09/2026, ver
   `PROCESO_DESARROLLO.md` §3), **en el repo de la tarea**, que normalmente NO es
   `krugkrug/meta`. Abrir el PR es fusionar —`auto-merge.yml` lo cierra solo en
   cuanto el CI se pone verde—, así que la sesión deja la rama commiteada y
   empujada, el preview local con su enlace, y espera. Hasta esa fecha este paso
   decía «trunk-based, nada de PRs ni ramas», que llevaba meses contradiciendo a
   `WEBAPP_GUARDRAILS_DEVOPS.md` §1 y a la práctica real. Y desde el 23/09/2026(2)
   la rama es **de la sesión**, no de esta tarea sola — usa la que ya tengas de
   este repo (Paso 2.1) si la hay:

   ```bash
   git checkout <rama-de-la-sesión> 2>/dev/null || git checkout -b <tipo>/<asunto>
     # el checkout sin -b reutiliza la rama de una tarea anterior de esta misma
     # sesión en este repo; el -b con <tipo>/<asunto> solo nace la primera vez
   git add <tus archivos> && git commit -m "<mensaje>"     # nunca sobre main
   git push -u origin HEAD             # nunca -f
   python3 panel-tareas/orquesta.py autodetectar --repo .   # la rama sale en Orquesta
   ```

   No arrastres al commit cambios ajenos a tu tarea (stash selectivo si hace falta).
   Si la rama ya trae commits de un requerimiento anterior de esta sesión, no la
   reescribas ni la rebases — el nuevo commit se apila encima. El PR, cuando
   Alfredo lo pida: `gh pr create --base main`, con todos los commits de la
   sesión dentro (uno o varios requerimientos).
5. **Prohibido marcar `hecha` sin que el trabajo esté en `main`.** Con el flujo por
   PR eso pasa al fusionarse el PR, no al empujar la rama: hasta entonces la tarea
   sigue `en-curso`, con su rama visible en Orquesta.
6. Cierre con `tarea.py patch <id>` (siempre en `krugkrug/meta`, que es donde vive
   `tareas.json` — no confundir con el repo de la tarea del paso 4):

   ```bash
   cd <ruta a krugkrug/meta>   # si trabajaste en otro repo, vuelve aquí
   python3 panel-tareas/tarea.py patch <id> \
     --set '{"estado":"hecha","sesion":null,"necesitaRespuesta":false}' \
     --nota "Qué hiciste, el commit del paso 4, si code-review encontró algo y qué se hizo, cómo verificarlo."
   ```

## La nota de cierre

Toda tarea que se cierra deja una nota con **estas cuatro cosas, en este orden**.
No es burocracia: es lo único que queda cuando dentro de tres meses alguien
pregunte por qué está así.

1. **Qué se hizo**, en una frase, en términos de comportamiento — no de archivos.
2. **Dónde está**: PR `#N` (o el commit, si entró por otra vía).
3. **Qué encontró `code-review`** y qué se hizo con ello; «nada» también se dice.
4. **Cómo verificarlo**: el comando o los clics concretos, no «probar que va».

Lo que NO va en la nota: el diff, el plan que ya está en el PR, ni disculpas.
Si te sale de más de seis líneas, es que estás copiando el PR — pon el enlace.

## Cómo bloquear

```bash
python3 panel-tareas/tarea.py patch <id> \
  --set '{"estado":"bloqueada","necesitaRespuesta":true,"sesion":null}' \
  --nota "<pregunta concreta>" --quien claude
```

También cuando el fallo es técnico (conflicto, push rechazado, test roto): sin
`necesitaRespuesta` la tarea muere en silencio. Nunca descartes una bloqueada.

## Escrituras concurrentes

El documento lo escriben el panel, la routine y las sesiones de escritorio.
`tarea.py` ya encapsula la regla (relee fresco, escritura que toca solo una
tarea, `ifMatch` con reintento) — es la razón de que exista. Si dos escrituras
a la misma tarea chocan de verdad (rarísimo si cada operación toca solo su
tarea), el script agota sus reintentos y para con instrucciones; no hay `-f`
que forzar aquí — el backend seguirá rechazando con 409 mientras el
`actualizado` que mandes no coincida con el real.

## Trampas heredadas (siguen vigentes)

- GitHub Actions como ejecutor está muerto: `tareas.yml` `disabled_manually`, y el
  `claude_code_oauth_token` se rechaza (2 tokens probados, con y sin `--model`,
  muere a los 2 s). No reintentar sin nueva información. (Esto es sobre el repo
  de la tarea, no sobre la cola — nada que ver con claudedash.)
- `tarea.py` necesita `CLAUDEDASH_PASSWORD` en el entorno (login de `home`, ver
  `panel-tareas/README.md`) — sin ella no puede entrar (401 "No autorizado").
- Editar `home/claudedash/index.html` **sí** se despliega solo (Vercel
  autodeploy tras el push a `main`); solo hace falta subir `PANEL_VERSION` en
  el propio archivo para que el badge delate un deploy que aún no ha llegado.

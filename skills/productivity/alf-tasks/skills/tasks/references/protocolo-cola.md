# Protocolo de ejecución de la cola

Cárgalo solo cuando vayas a **ejecutar** tareas. Para abrir el panel y resumir no
hace falta. El almacén es `panel-tareas/tareas.json` en `krugkrug/meta` (main).

## Toda escritura a tareas.json va por `panel-tareas/tarea.py`

**No edites `tareas.json` a mano (ni con Python/jq ad-hoc) en ningún paso de este
documento.** Usa siempre:

```bash
python3 panel-tareas/tarea.py get <id>
python3 panel-tareas/tarea.py patch <id> --set '<json de campos a fusionar>' \
    [--nota "texto"] [--quien claude]
python3 panel-tareas/tarea.py nueva --json '<json de la tarea, sin id>'
```

Por qué es obligatorio y no una sugerencia: el 16/09/2026 un agente cerró la
tarea 14 volcando el array **entero** de `tareas.json` desde una copia que
llevaba 11 minutos sosteniendo en memoria (leída en el Paso 2.1, reescrita
entera en el Paso 2.6) — mientras tanto el panel dio de alta las tareas 15 y
16, que desaparecieron pisadas por ese commit. No fue un fallo de "faltó hacer
`git pull`": fue serializar una copia vieja del array completo en vez de
releer el archivo justo antes de escribir. `tarea.py` lo hace estructuralmente
imposible: cada operación relee `tareas.json` del disco en el momento de
escribir, toca solo la tarea indicada (o añade una sola tarea nueva y sube
`siguienteId`), y comitea+empuja con reintento (`pull --rebase` + push, nunca
`-f`) si otra sesión escribió entre medias. Detalle y garantías completas en
la cabecera del propio script (`--help` o leer el docstring).

Si por lo que sea `tarea.py` no está disponible en el checkout (repo viejo sin
este archivo), cae al patrón manual de siempre — pull inmediato, edición que
toque solo tu tarea, push inmediato — pero es el camino degradado, no el
normal.

---

## Paso 0 — sincronizar y sanear

```bash
git pull --rebase origin main
```

Lo que diga el archivo tras el pull es la verdad. Saneos baratos antes de decidir:

- **`en-curso` con `sesion` de otra sesión y sin actividad reciente** (mira
  `actualizada`; el umbral del panel es 15 min): sesión muerta. Antes de rehacer
  nada, comprueba con `git log --oneline -20 origin/main` si el trabajo ya llegó;
  si llegó, salta a la entrega; si no, retómala (pon tu `sesion`).
- **`en-curso` sin `sesion`**: tarjeta fantasma. Igual que la anterior.
- **`dependeDe` apuntando a una tarea hecha o descartada**: ya no bloquea, se
  ejecuta con normalidad.

Anota en `notas` cualquier saneo que hagas.

## Paso 0.5 — triaje del backlog

Antes de decidir por semáforo, procesa toda tarea con `estado: "backlog"`
(las crea el panel con "+ Nueva tarea": sin modelo ni fases, solo título,
descripción, prioridad y dependencia — `backlog` sustituyó a `sin-refinar`
desde el panel v14). Este paso reemplaza al humano eligiendo `modelo` a mano —
lo decide quien va a ejecutar, con el trabajo delante — y es más completo que
el botón "Promover a Pendiente" de la vista Planificación del panel: ese botón
solo pide el modelo; esto además bloquea lo insuficiente y descompone en fases.
Si Alfredo ya promovió una tarea a mano desde el panel, llega aquí como
`pendiente` con modelo puesto y no pasa por este paso — no hay que repetirlo.

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
2. Trabaja en el repo que diga el campo `repo` (clónalo o entra en él; `git pull`
   primero). Si quien ejecuta esta tarea es un subagente lanzado por otra sesión
   (p. ej. `/tasks taskrun`), esa sesión ya lo lanzó con el modelo del campo
   `modelo` — no hay nada que hacer aquí con ese campo.
3. Antes de dar la tarea por cerrada, pasa QA barato sobre tu propio diff: carga
   la skill `code-review` (nivel `low` si la tarea es mecánica, `medium` si toca
   lógica) sobre los cambios sin commitear. Si hay hallazgos confirmados,
   arréglalos antes de seguir; si algo es dudoso o de diseño mayor, anótalo en
   `notas` en vez de bloquear la entrega por ello.
4. Entrega trunk-based — nada de PRs ni ramas — **en el repo de la tarea**, que
   normalmente NO es `krugkrug/meta`:

   ```bash
   git add <tus archivos> && git commit -m "<mensaje>"
   git pull --rebase origin main
   COMMIT=$(git rev-parse HEAD)
   git push origin HEAD:main          # nunca -f
   git fetch origin main
   git merge-base --is-ancestor "$COMMIT" origin/main && echo "CONFIRMADO EN MAIN"
   ```

   No arrastres al commit cambios ajenos a tu tarea (stash selectivo si hace falta).
5. **Prohibido marcar `hecha` sin "CONFIRMADO EN MAIN" en esta sesión.**
6. Cierre con `tarea.py patch <id>` (siempre en `krugkrug/meta`, que es donde vive
   `tareas.json` — no confundir con el repo de la tarea del paso 4):

   ```bash
   cd <ruta a krugkrug/meta>   # si trabajaste en otro repo, vuelve aquí
   python3 panel-tareas/tarea.py patch <id> \
     --set '{"estado":"hecha","sesion":null,"necesitaRespuesta":false}' \
     --nota "Qué hiciste, el commit del paso 4, si code-review encontró algo y qué se hizo, cómo verificarlo."
   ```

## Cómo bloquear

```bash
python3 panel-tareas/tarea.py patch <id> \
  --set '{"estado":"bloqueada","necesitaRespuesta":true,"sesion":null}' \
  --nota "<pregunta concreta>" --quien claude
```

También cuando el fallo es técnico (conflicto, push rechazado, test roto): sin
`necesitaRespuesta` la tarea muere en silencio. Nunca descartes una bloqueada.

## Escrituras concurrentes

El archivo lo escriben el panel, la routine y las sesiones de escritorio.
`tarea.py` ya encapsula la regla (pull inmediato, escritura que toca solo una
tarea, push inmediato con reintento) — es la razón de que exista. Si el rebase
del reintento entra en conflicto real (dos escrituras a la misma tarea a la
vez, rarísimo si cada operación toca solo su tarea), el script aborta el
rebase, deja el working tree limpio y para con instrucciones; no lo fuerces
con `-f`. Conserva el formato del JSON si alguna vez tocas el archivo a mano:
2 espacios de indentación, UTF-8, salto final.

## Trampas heredadas (siguen vigentes)

- El conector MCP de GitHub no escribe en `.github/workflows/` (403): por git local.
- GitHub Actions como ejecutor está muerto: `tareas.yml` `disabled_manually`, y el
  `claude_code_oauth_token` se rechaza (2 tokens probados, con y sin `--model`,
  muere a los 2 s). No reintentar sin nueva información.
- Editar `panel-tareas/index.html` no actualiza el Artifact: republicar y subir
  `PANEL_VERSION`.

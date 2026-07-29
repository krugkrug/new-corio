---
name: tasks
description: Abre el panel de tareas de Alfredo y ejecuta su cola. La cola son GitHub Issues de krugkrug/meta y krugkrug/ratioc etiquetados con prio:*, semaforo:*, estado:* y modelo:*; el panel es un Artifact privado de claude.ai que solo sabe leer y escribir issues. Úsala cuando el usuario diga "/tasks", "abre el panel", "el panel de tareas", "lanza las tareas", "ejecuta la cola", "qué tengo pendiente", "tareas pendientes", "reanuda las paradas" o pregunte por el estado de sus tareas — aunque no mencione la palabra "panel".
---

# Panel de tareas — abrir y ejecutar la cola

**Versión:** v1.0 · **Fecha:** 29/07/2026 · **Responsable:** Alfredo Sánchez-Bella Solís

Esta skill hace dos cosas, en este orden: **(1) abre el panel** y **(2) hace de ejecutor
de la cola**. Hoy el ejecutor automático está apagado (§5), así que si el usuario dice
"lánzalas", el ejecutor eres tú.

---

## 1. Abrir el panel (siempre lo primero)

El panel está publicado como Artifact privado de claude.ai:

> **https://claude.ai/code/artifact/284a3191-1e0d-4369-b695-8ab41de5a301**

Ábrelo en el navegador integrado:

```
preview_start  { url: "https://claude.ai/code/artifact/284a3191-1e0d-4369-b695-8ab41de5a301" }
```

Si el entorno no tiene navegador integrado, **da el enlace y sigue**: el panel es una
comodidad visual, no una dependencia — todo lo de §3 y §4 se hace contra la API de GitHub.

Luego, en la misma respuesta, lee la cola (§2) y resume el estado. No te quedes en
"panel abierto": el usuario quiere saber qué hay dentro.

**Fuente del panel:** `panel-tareas/index.html` en `krugkrug/meta` — una página
autocontenida (HTML+CSS+JS inline, sin build). Editar ese archivo **no** actualiza el
Artifact publicado: republicarlo es un paso manual de Alfredo. Si tocas el archivo, dilo.

---

## 2. Qué es una tarea

Una tarea **es un GitHub Issue**. No hay base de datos ni fichero de tareas: la cola
vive en los issues de estos repos (los que el panel carga por defecto):

- `krugkrug/meta`
- `krugkrug/ratioc`

El usuario puede añadir más repos desde la barra lateral del panel; si menciona uno que
no está en la lista, míralo igualmente.

Para leer la cola: `list_issues` (o `search_issues`) con estado abierto, y clasifica por
la etiqueta `estado:*`.

### Vocabulario de etiquetas

| Etiqueta | Valores | Qué significa |
|---|---|---|
| `prio:*` | `alta` · `media` · `baja` | Orden de trabajo. Solo ordena el tablero; no cambia lo que se hace. |
| `semaforo:*` | `verde` · `amarillo` · `rojo` | **El guardarraíl real.** Verde: reversible y barato → ejecuta sin preguntar. Amarillo o rojo: caro o irreversible → **no toques nada**, pregunta y bloquea. Es el semáforo de `CLAUDE.md` aplicado a la cola. |
| `estado:*` | `pendiente` · `en-curso` · `bloqueada` · `hecha` | Máquina de estados. **Exactamente una** por issue, siempre. |
| `necesita-respuesta` | — | Hay una pregunta abierta esperando a Alfredo. Obligatoria en toda tarea bloqueada. |
| `modelo:*` | `haiku` · `sonnet` · `opus` | Modelo con el que se pidió ejecutarla. Sin etiqueta → Sonnet. Respétalo si puedes elegir. |

### Dependencias

Una línea en el **cuerpo** del issue, con este formato literal:

```
Depende de: #31
```

Mientras el issue #31 siga abierto, la dependiente **no se ejecuta**. Cuando lo cierres,
puedes encadenar la dependiente en la misma pasada. Solo aplica a issues del mismo repo;
si apunta a otro repo, ignórala.

---

## 3. Ejecutar la cola

Cuando el usuario diga "lanza las tareas", "ejecuta la cola" o similar:

### Paso 0 — normalizar antes de decidir nada

Lee el estado real de cada issue abierto y arréglalo si está roto:

- **Más de una etiqueta `estado:*`**: déjala en una. Si `pendiente` está entre ellas,
  quédate con `pendiente` (o falló una transición a medias, o Alfredo la reencoló: en
  ambos casos toca trabajar). Si no, quédate con la más avanzada: `hecha` > `bloqueada`
  > `en-curso`.
- **Cero etiquetas `estado:*`**: pon `estado:pendiente`.
- **`estado:en-curso` sin nadie trabajando** (típico: una sesión que murió a mitad):
  antes de rehacer nada, comprueba si el trabajo ya llegó a `main`:

  ```bash
  git fetch origin main && git log --oneline -20 origin/main
  ```

  Si ya está: no lo repitas, salta directo a la entrega. Si no: retómala desde el principio.

Di en un comentario qué has normalizado y por qué.

### Paso 1 — decidir por semáforo

- **`semaforo:verde` + `estado:pendiente`** → márcala `estado:en-curso` y **ejecútala**.
- **`semaforo:amarillo` o `semaforo:rojo`** → **no edites nada**. Comenta la pregunta
  concreta y bloquea (§4).
- **`estado:bloqueada` + hay respuesta nueva de Alfredo en el hilo** → ese comentario
  **es** el OK que faltaba, también en amarillo y rojo. Pásala a `estado:en-curso` y
  ejecútala. Relee el hilo entero antes: no vuelvas a preguntar lo que ya está contestado.
- **`estado:hecha`** → no hagas nada. Si Alfredo quiere más, la reencolará.

**Tope anti-bucle:** si una tarea ya se ha bloqueado 2 veces en el hilo, no puedes
bloquearla otra vez. Ejecuta lo que sí puedas, **declara por escrito los supuestos** que
hayas tenido que asumir, y entrega.

### Paso 2 — entregar (trunk-based, sin PR)

Estos son repos de trabajo en solitario. **Commit y push directo a `main`.** Nada de
pull requests: una rama sin fusionar es trabajo perdido, y `limpiar-ramas.yml` puede
borrarla.

```bash
git add -A && git commit -m "<mensaje>"
git pull --rebase origin main
COMMIT=$(git rev-parse HEAD)
git push origin HEAD:main          # nunca -f, nunca --force
git fetch origin main
git merge-base --is-ancestor "$COMMIT" origin/main && echo "CONFIRMADO EN MAIN"
git status --porcelain              # tiene que salir vacío
```

**Prohibido marcar `estado:hecha` sin haber visto "CONFIRMADO EN MAIN" y
`git status --porcelain` vacío en esta misma sesión.** "He hecho commit" no es haber
entregado.

Con la verificación en verde: comenta un resumen de qué hiciste y cómo comprobarlo,
pon `estado:hecha` y **cierra el issue**.

### Paso 3 — comprobación final

Cada issue tocado debe quedar con **exactamente una** etiqueta `estado:*`, y si es
`hecha`, sin `necesita-respuesta`.

### Reglas de las transiciones de etiquetas

Cambia `--add-label` y `--remove-label` **en una sola llamada** por transición. Dos
llamadas dejan una ventana con dos etiquetas `estado:*` y ensucian la máquina de estados.

```bash
gh issue edit <n> --add-label estado:en-curso --remove-label estado:pendiente
```

Con el conector MCP de GitHub, `issue_write` con `method: "update"` **reemplaza el
conjunto entero de etiquetas**: construye la lista completa (conservando `prio:*`,
`semaforo:*` y `modelo:*`) y mándala de una vez.

---

## 4. Cómo bloquear (siempre igual)

Comenta qué te falta —la pregunta concreta, no "necesito más contexto"— y:

```bash
gh issue edit <n> --add-label estado:bloqueada --add-label necesita-respuesta \
  --remove-label estado:pendiente --remove-label estado:en-curso
```

`necesita-respuesta` es **obligatoria**: es lo que enciende el aviso "⚑ necesita tu
respuesta" en el panel y lo que permite reconocer la respuesta después. Bloquea así
también cuando lo que falla es técnico (conflicto de rebase, push rechazado, test roto):
sin esa etiqueta la tarea se queda muerta y nadie sabe que te espera.

**No cierres nunca un issue bloqueado.**

---

## 5. Quién ejecuta de verdad (estado a 29/07/2026)

**No hay ejecutor automático escuchando.** Comprobado con `gh api`: el workflow
`.github/workflows/tareas.yml` está `disabled_manually` en `krugkrug/meta` y en
`krugkrug/ratioc`.

Historia, para que nadie lo reintente sin saberlo: el workflow funcionaba, pero consumía
créditos de la API. Se intentó pasarlo a `claude_code_oauth_token` para que fuera contra
la suscripción y **la autenticación se rechaza** — probado con dos tokens distintos, con
y sin `--model`: muere a los 2 segundos, coste cero, sin denegación de permisos. Los
archivos siguen en los repos, desactivados.

Consecuencia práctica: **poner o cambiar una etiqueta no lanza nada.** El botón "Lanzar
pendientes" del panel re-sella `estado:pendiente` para reemitir el evento, pero es un
disparo al aire mientras no haya nadie escuchando. Cuando Alfredo dice "lanza las
tareas", quiere decir **hazlas tú, aquí, ahora** (§3).

---

## 6. Trampas conocidas (costaron tiempo)

- El conector MCP de GitHub **no puede escribir en `.github/workflows/`** (403). Si un
  cambio toca esa ruta, hazlo por git local; y si estás dentro de la Claude Code Action,
  el push será rechazado: deja el archivo corregido en `plantillas/`, explica qué hay que
  copiar y dónde, y bloquea — no marques `hecha`.
- El input de la Claude Code Action es `prompt`, **no** `direct_prompt`.
- Los comentarios de progreso del agente firman como `claude[bot]`: para ignorar eventos
  de bots hay que filtrar por `github.event.sender.type != 'Bot'`, no por login.
- Una tarea en `estado:en-curso` cuya sesión murió **no la despierta ningún evento**. Por
  eso el Paso 0 empieza siempre por rescatarlas. El panel las marca en rojo como "posible
  run muerto" a los 15 minutos sin actividad.
- Reabrir un issue `estado:hecha` no dispara nada. Para relanzarlo hay que ponerle
  `estado:pendiente`.

---

## 7. Qué hace el panel por su cuenta

Botones de la barra superior, por si el usuario los menciona:

- **+ Nueva tarea** — crea el issue con sus cuatro etiquetas (prio, semáforo, estado, modelo).
- **↻ Reanudar paradas** — devuelve a `estado:pendiente` las tareas que llevan más de
  15 min en `en-curso` sin actividad, y comenta el motivo en cada una.
- **🧹 Limpiar hechas** — las oculta del tablero (no las borra de GitHub) y cierra las que
  se quedaron abiertas con la etiqueta `estado:hecha`.
- **▶ Lanzar pendientes** — re-sella `estado:pendiente` para reemitir el evento (ver §5).

El panel **no puede ejecutar nada**: su conector solo sabe leer y escribir issues.

---

## Anti-patrones

- Marcar `hecha` sin haber verificado el push en `main`.
- Bloquear sin `necesita-respuesta` (la tarea desaparece del radar).
- Dejar dos etiquetas `estado:*` a la vez.
- Abrir un PR "por prudencia" en un repo trunk-based.
- Tocar algo en `semaforo:amarillo` o `semaforo:rojo` sin respuesta explícita de Alfredo.
- Volver a preguntar lo que ya está contestado en el hilo.
- Rehacer trabajo que ya está en `main` porque el issue se quedó en `en-curso`.

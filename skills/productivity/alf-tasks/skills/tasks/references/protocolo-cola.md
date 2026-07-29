# Protocolo de ejecución de la cola

Cárgalo solo cuando vayas a **ejecutar** tareas. Para abrir el panel y resumir el
estado no hace falta.

---

## Paso 0 — normalizar antes de decidir nada

Lee el estado real de cada issue abierto y arréglalo si está roto.

- **Más de una etiqueta `estado:*`**: déjala en una. Si `pendiente` está entre ellas,
  quédate con `pendiente` — una transición correcta nunca deja `pendiente` detrás: o
  falló a medias, o Alfredo reencoló la tarea; en ambos casos toca trabajar. Si no,
  quédate con la más avanzada: `hecha` > `bloqueada` > `en-curso`.
- **Cero etiquetas `estado:*`**: pon `estado:pendiente` y sigue.
- **`estado:en-curso` sin nadie trabajando** (sesión muerta a mitad): antes de rehacer
  nada, comprueba si el trabajo ya llegó a `main`:

  ```bash
  git fetch origin main && git log --oneline -20 origin/main
  ```

  Si ya está: no lo repitas, salta directo a la entrega (Paso 2). Si no está: retómala
  desde el principio manteniendo `estado:en-curso`.

Di en un comentario qué has normalizado y por qué.

---

## Paso 1 — decidir por semáforo

| Situación | Qué haces |
|---|---|
| `semaforo:verde` + `estado:pendiente` | `estado:en-curso` y **ejecuta** |
| `semaforo:amarillo` o `semaforo:rojo` | **No edites nada.** Pregunta lo concreto y bloquea |
| `estado:bloqueada` + respuesta nueva de Alfredo en el hilo | Ese comentario **es** el OK que faltaba, también en amarillo y rojo → `estado:en-curso` y ejecuta |
| `estado:hecha` | Nada. Si Alfredo quiere más, la reencolará |

Antes de ejecutar una desbloqueada, **relee el hilo entero**: no vuelvas a preguntar lo
que ya está contestado.

**Dependencias.** Si el cuerpo tiene una línea `Depende de: #N` y el issue N sigue
abierto, no la ejecutes. Cuando cierres N, puedes encadenar la dependiente en la misma
pasada. Solo aplica dentro del mismo repo.

**Tope anti-bucle.** Cuenta cuántas veces se ha bloqueado ya esa tarea en el hilo. A la
tercera no puedes volver a bloquear: ejecuta lo que sí puedas, **declara por escrito los
supuestos** que hayas asumido, y entrega. Para volver a bloquear tras un desbloqueo hay
que citar (i) la pregunta anterior, (ii) la respuesta de Alfredo y (iii) por qué esa
respuesta no cubre la duda nueva. Sin las tres cosas: asume y sigue.

---

## Paso 2 — entregar (trunk-based, sin PR)

Repos de trabajo en solitario: **commit y push directo a `main`**. Nada de pull requests
— una rama sin fusionar es trabajo perdido, y `limpiar-ramas.yml` puede borrarla.

Si el árbol tiene cambios ajenos a tu tarea (típico: trabajo a medias de Alfredo), **no
los arrastres al commit**: añade solo tus archivos, o guárdalos con
`git stash push -- <ruta>` antes del rebase y recupéralos después.

```bash
git add <tus archivos> && git commit -m "<mensaje>"
git pull --rebase origin main
COMMIT=$(git rev-parse HEAD)
git push origin HEAD:main          # nunca -f, nunca --force
git fetch origin main
git merge-base --is-ancestor "$COMMIT" origin/main && echo "CONFIRMADO EN MAIN"
git status --porcelain              # sin tus archivos pendientes
```

**Prohibido marcar `estado:hecha` sin haber visto "CONFIRMADO EN MAIN" en esta misma
sesión.** "He hecho commit" no es haber entregado.

Si el rebase da conflicto y sabes resolverlo, resuélvelo; si no, bloquea.

Con la verificación en verde: comenta un resumen de qué hiciste y **cómo comprobarlo**,
pon `estado:hecha` y cierra el issue.

---

## Paso 3 — comprobación final

Cada issue tocado queda con **exactamente una** etiqueta `estado:*`, y si es `hecha`,
sin `necesita-respuesta`.

```bash
gh issue view <n> --json labels --jq '[.labels[].name|select(startswith("estado:"))]'
```

Si sale 0 o 2+, corrígelo ahí mismo.

---

## Cómo bloquear (siempre igual, sin excepciones)

Comenta **la pregunta concreta** —no "necesito más contexto"— y:

```bash
gh issue edit <n> --add-label estado:bloqueada --add-label necesita-respuesta \
  --remove-label estado:pendiente --remove-label estado:en-curso
```

`necesita-respuesta` es **obligatoria**: enciende el aviso "⚑ necesita tu respuesta" en
el panel y es lo que permite reconocer la respuesta después. Bloquea igual cuando lo que
falla es técnico (conflicto de rebase, push rechazado, test roto): sin esa etiqueta la
tarea se queda muerta y nadie sabe que te espera.

**No cierres nunca un issue bloqueado.**

---

## Transiciones de etiquetas

Cambia `--add-label` y `--remove-label` **en una sola llamada**. Dos llamadas dejan una
ventana con dos etiquetas `estado:*` y ensucian la máquina de estados.

Con el conector MCP de GitHub, `issue_write` + `method: "update"` **reemplaza el conjunto
entero de etiquetas**: construye la lista completa conservando `prio:*`, `semaforo:*` y
`modelo:*`, y mándala de una vez.

---

## Trampas conocidas (cada una costó tiempo)

- El conector MCP de GitHub **no puede escribir en `.github/workflows/`** (403). Esos
  archivos van por git local. Dentro de la Claude Code Action el push a esa ruta también
  se rechaza (falta el permiso `workflows`): deja el archivo corregido en `plantillas/`,
  explica en un comentario qué hay que copiar y dónde, y **bloquea** — no marques `hecha`.
- El input de la Claude Code Action es `prompt`, **no** `direct_prompt`.
- Los comentarios de progreso del agente firman como `claude[bot]`: para ignorar eventos
  de bots hay que filtrar por `github.event.sender.type != 'Bot'`, no por login.
- Una tarea en `estado:en-curso` cuya sesión murió **no la despierta ningún evento**. Por
  eso el Paso 0 empieza por rescatarlas; el panel las marca en rojo como "posible run
  muerto" a los 15 min sin actividad.
- Reabrir un issue `estado:hecha` no dispara nada. Para relanzarlo hay que ponerle
  `estado:pendiente`.
- Un issue sin ninguna etiqueta `estado:*` no lo despierta nada. Rescate: `estado:pendiente`.

---

## Historia del ejecutor automático (no lo reintentes a ciegas)

El workflow `.github/workflows/tareas.yml` funcionaba, pero consumía créditos de la API.
Se intentó pasarlo a `claude_code_oauth_token` para que fuera contra la suscripción y
**la autenticación se rechaza**: probado con dos tokens distintos, con y sin `--model`,
muere a los 2 segundos, coste cero, sin denegación de permisos. Se desactivó.

Comprueba el estado real antes de afirmar nada (§ "Quién ejecuta" del SKILL.md):

```bash
gh api repos/<owner>/<repo>/actions/workflows --jq '.workflows[] | select(.path==".github/workflows/tareas.yml") | .state'
```

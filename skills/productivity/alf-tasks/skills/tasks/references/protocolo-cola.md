# Protocolo de ejecución de la cola

Cárgalo solo cuando vayas a **ejecutar** tareas. Para abrir el panel y resumir no
hace falta. El almacén es `panel-tareas/tareas.json` en `krugkrug/meta` (main).

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

## Paso 0.5 — triaje de tareas sin refinar

Antes de decidir por semáforo, procesa toda tarea con `estado: "sin-refinar"`
(las crea el panel con "+ Nueva tarea": sin modelo ni fases, solo título,
descripción, prioridad y dependencia). Este paso reemplaza al humano eligiendo
`modelo` a mano — lo decide quien va a ejecutar, con el trabajo delante.

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
Misma disciplina de escritura: pull inmediato antes, una tarea (o su troceo
completo) por escritura, push inmediato.

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

1. Marca el arranque **en una sola edición** de `tareas.json`: `estado: "en-curso"`,
   `sesion: {id, donde, desde}`, `actualizada`, y commit+push de ese cambio. Es lo
   que el panel enseña como "quién está trabajando".
2. Trabaja en el repo que diga el campo `repo` (clónalo o entra en él; `git pull`
   primero). Si quien ejecuta esta tarea es un subagente lanzado por otra sesión
   (p. ej. `/tasks taskrun`), esa sesión ya lo lanzó con el modelo del campo
   `modelo` — no hay nada que hacer aquí con ese campo.
3. Antes de dar la tarea por cerrada, pasa QA barato sobre tu propio diff: carga
   la skill `code-review` (nivel `low` si la tarea es mecánica, `medium` si toca
   lógica) sobre los cambios sin commitear. Si hay hallazgos confirmados,
   arréglalos antes de seguir; si algo es dudoso o de diseño mayor, anótalo en
   `notas` en vez de bloquear la entrega por ello.
4. Entrega trunk-based — nada de PRs ni ramas:

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
6. Cierre, otra vez en una sola edición de `tareas.json`: `estado: "hecha"`,
   `sesion: null`, `necesitaRespuesta: false`, nota en `notas` con qué hiciste,
   el commit, si `code-review` encontró algo (y qué se hizo), y cómo verificarlo.
   Commit+push del archivo.

## Cómo bloquear

Una sola edición: la pregunta concreta como nota (`quien: "claude"` o el nombre de
la routine), `estado: "bloqueada"`, `necesitaRespuesta: true`, `sesion: null`.
También cuando el fallo es técnico (conflicto, push rechazado, test roto): sin
`necesitaRespuesta` la tarea muere en silencio. Nunca descartes una bloqueada.

## Escrituras concurrentes

El archivo lo escriben el panel, la routine y las sesiones de escritorio. Regla:
**pull inmediatamente antes de cada escritura, escritura pequeña, push inmediato.**
Si el push rebota, `git pull --rebase` y reintenta; el JSON casi nunca conflicta si
cada escritura toca solo su tarea. Conserva el formato: 2 espacios de indentación,
UTF-8, salto final.

## Trampas heredadas (siguen vigentes)

- El conector MCP de GitHub no escribe en `.github/workflows/` (403): por git local.
- GitHub Actions como ejecutor está muerto: `tareas.yml` `disabled_manually`, y el
  `claude_code_oauth_token` se rechaza (2 tokens probados, con y sin `--model`,
  muere a los 2 s). No reintentar sin nueva información.
- Editar `panel-tareas/index.html` no actualiza el Artifact: republicar y subir
  `PANEL_VERSION`.

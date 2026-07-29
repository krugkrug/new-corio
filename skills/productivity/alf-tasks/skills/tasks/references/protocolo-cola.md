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
   primero).
3. Entrega trunk-based — nada de PRs ni ramas:

   ```bash
   git add <tus archivos> && git commit -m "<mensaje>"
   git pull --rebase origin main
   COMMIT=$(git rev-parse HEAD)
   git push origin HEAD:main          # nunca -f
   git fetch origin main
   git merge-base --is-ancestor "$COMMIT" origin/main && echo "CONFIRMADO EN MAIN"
   ```

   No arrastres al commit cambios ajenos a tu tarea (stash selectivo si hace falta).
4. **Prohibido marcar `hecha` sin "CONFIRMADO EN MAIN" en esta sesión.**
5. Cierre, otra vez en una sola edición de `tareas.json`: `estado: "hecha"`,
   `sesion: null`, `necesitaRespuesta: false`, nota en `notas` con qué hiciste,
   el commit, y cómo verificarlo. Commit+push del archivo.

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

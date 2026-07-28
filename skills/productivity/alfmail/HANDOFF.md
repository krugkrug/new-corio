# Handoff — email-triage-plugin (repo GitHub: alfmail)

_Last updated: 2026-07-20 — by Cowork_

## Context

Plugin personal de Alfredo para triaje de Gmail (`/email`, `/summary` → skill `email-triage`). Se rediseñó el comportamiento por defecto: en vez de una lista markdown de tres niveles en el chat, ahora usa una tabla interactiva (artefacto Cowork `triage-inbox`) que verifica mensaje a mensaje qué sigue realmente en INBOX (la búsqueda agregada de Gmail da falsos positivos por caché) y deja elegir acción por fila.

## Decisions made

- Verificar cada correo con `get_message` (METADATA_ONLY) antes de mostrarlo — la búsqueda por hilo de Gmail puede incluir hilos ya archivados si algún mensaje antiguo del hilo aún tenía la etiqueta INBOX.
- Formato por defecto = tabla interactiva (artefacto), no lista en chat — a petición explícita del usuario, para poder editar el borrador y ejecutar acciones en bloque.
- Acciones por fila: Archivar / Responder / Borrar / Reenviar, con "No hacer nada" como default siempre. Nada se ejecuta hasta pulsar "Ejecutar acciones" (procesa todo en bloque, sin confirmación adicional por fila, porque el clic ya es la confirmación).
- "Responder" y "Reenviar" solo crean borrador (`create_draft`) — este conector Gmail no tiene herramienta de envío. Hay que decirlo siempre explícitamente, porque cualquier automatización downstream de Alfredo (reenvío "drive gt"/"drive corio" a sí mismo) depende de que el correo se envíe de verdad, no solo se redacte.
- El HTML de la tabla se empaquetó dentro del plugin (`skills/email-triage/assets/triage-inbox.html`) en vez de regenerarse desde cero cada sesión, para que no haya deriva entre ejecuciones.
- El prefijo del conector Gmail MCP (`mcp__<id>__`) queda como placeholder (`GMAIL_MCP_PREFIX_PLACEHOLDER`) en el archivo empaquetado — se sustituye en caliente cada sesión por el prefijo real (buscándolo en las tools conectadas), porque el id del conector puede cambiar si Alfredo reconecta Gmail.

## Files & resources

- `skills/email-triage/SKILL.md` — skill reescrita: Step 1 verifica mensaje a mensaje, Step 3 usa el asset empaquetado en vez de generar HTML ad hoc, Step 4 documenta la semántica de ejecución en bloque y la limitación de "solo borrador, nunca envío".
- `skills/email-triage/assets/triage-inbox.html` — implementación probada de la tabla interactiva (verificación + resumen con IA + acciones en bloque). Único archivo que hay que tocar si cambia el comportamiento real.
- `commands/email.md`, `commands/summary.md` — actualizados para reflejar el nuevo formato.
- Artefacto Cowork `triage-inbox` (id reutilizable en `mcp__cowork__create_artifact` / `update_artifact`) — la instancia visible del HTML empaquetado, se refresca en vivo al abrirla.

## Next steps

- [ ] Confirmar en `https://github.com/krugkrug/alfmail/commits/main` si el último commit visible es **"asc"** (`cf36ec6`) — el sandbox de Cowork tiene bloqueada la salida de red hacia GitHub (tanto `git push`/`fetch` como `web_fetch` a github.com/api.github.com dan error), así que el estado del remoto no se pudo verificar desde aquí. Si no está, hay que repetir el push desde el propio equipo de Alfredo.
- [ ] Una vez confirmado el push, reinstalar el plugin desde Settings > Capabilities apuntando a `https://github.com/krugkrug/alfmail` (Alfredo lo desinstaló durante la sesión) para que `/email` y `/summary` carguen la versión nueva del SKILL.md — hasta ahora seguían mostrando el formato viejo de tres niveles porque la copia instalada en Cowork es una caché aparte del repo.
- [ ] Tras reinstalar, volver a invocar `/email-triage` y comprobar que carga el SKILL.md nuevo (Step 3 debería mencionar la tabla interactiva, no el formato `# Inbox Triage — [Today's Date]`).
- [ ] Revisar y, si procede, borrar el borrador de prueba "Verificación herramienta de triaje (borrar)" que quedó en Gmail al verificar el formato de `create_draft`.

## Open questions

- Los commits intermedios `10ad606 adads` y `cf36ec6 asc` en el repo local los generó el propio cliente Git de Alfredo (parece que capturó el archivo a medio escribir y luego lo completó) — el contenido final en `cf36ec6` se verificó íntegro, pero merece un vistazo si algo no cuadra al reabrir el repo.
- Los locks de `.git` (`index.lock`, `HEAD.lock`, `objects/maintenance.lock`) se quedaron pegados durante la sesión — probablemente por algún cliente Git (GitHub Desktop/VS Code) con el repo abierto. Si vuelve a pasar, cerrar todos los clientes Git antes de comitear.

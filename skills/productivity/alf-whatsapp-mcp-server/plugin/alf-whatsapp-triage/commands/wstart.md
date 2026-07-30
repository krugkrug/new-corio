---
name: wstart
description: Lanza (o reinicia) el servidor MCP de WhatsApp en local — necesario cuando las tools mcp__whatsapp__* fallan con "client is not ready"
allowed-tools: Bash
---

## Lanzar el servidor MCP de WhatsApp

Cuando el usuario diga `/wstart` (o cuando cualquier tool `mcp__whatsapp__*`
falle con `WhatsApp client is not ready. Call initialize() first`), levanta el
servidor local:

1. Ejecuta **en segundo plano** (`run_in_background: true` en Bash — es un proceso
   de larga duración, mantiene el socket abierto mientras dura):

   ```bash
   cd "C:\Users\alfre\Documents\GitHub\meta\skills\productivity\alf-whatsapp-mcp-server" && npm run mcp:start
   ```

2. Espera unos segundos y revisa la salida del proceso en segundo plano. Busca:
   - **Un QR en ASCII** → el emparejamiento ya no es válido (o es la primera vez).
     Pide al usuario que lo escanee desde el móvil: WhatsApp → Ajustes →
     Dispositivos vinculados → Vincular un dispositivo.
   - **`connection.update` → `open`** o un mensaje equivalente de "conectado" →
     el servidor está listo, avísale al usuario.
   - Si ya existe `.baileys_auth-default/` (sesión previa cacheada), normalmente
     reconecta solo, sin pedir QR de nuevo.

3. Confírmale al usuario que puede reintentar la operación que había fallado
   (p. ej. `/whatsapp` o `whatsapp_list_groups`).

### Notas

- El nombre de sesión por defecto es `default` (variable `WHATSAPP_SESSION_NAME`
  en `.env`, ver `.env.example`). Las credenciales quedan cacheadas en
  `.baileys_auth-default/` — no hace falta re-escanear el QR salvo que se borre
  esa carpeta o se revoque el dispositivo vinculado desde el móvil.
- Si el proceso ya estaba corriendo (otra sesión lo lanzó), no lo dupliques:
  comprueba antes si ya responde `whatsapp_list_groups` sin error.
- `npm run mcp:start` usa `tsx` directamente sobre `src/mcp-server/index.ts` (no
  hace falta `npm run build` primero — eso es solo para producción/registro
  como dependencia compilada).

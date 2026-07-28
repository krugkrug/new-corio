// One-shot WhatsApp pairing helper.
// The MCP server (src/mcp-server/whatsapp.ts) never surfaces the QR event, so
// pairing must happen out-of-band. This script opens a Baileys socket, serves
// the current QR at http://localhost:3737 (auto-refreshing, QRs rotate ~20s),
// saves credentials to WHATSAPP_AUTH_DIR, and exits once paired.
import makeWASocket, {
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason,
} from '@whiskeysockets/baileys';
import qrcode from 'qrcode-terminal';
import pino from 'pino';
import http from 'http';

const AUTH_DIR = process.env.WHATSAPP_AUTH_DIR ?? '.baileys_auth';
const PORT = 3737;
const TIMEOUT_MIN = Number(process.env.PAIR_TIMEOUT_MIN) || 15;

let asciiQR = '';
let status = 'starting'; // starting | qr | paired | logged_out
let pairedAs = '';
let sock = null;

function log(msg) {
  console.log(`[pair] ${new Date().toISOString()} ${msg}`);
}

async function createSocket() {
  const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
  const { version } = await fetchLatestBaileysVersion();
  sock = makeWASocket({
    auth: state,
    version,
    logger: pino({ level: 'silent' }),
  });
  sock.ev.on('creds.update', saveCreds);
  sock.ev.on('connection.update', ({ connection, lastDisconnect, qr }) => {
    if (qr) {
      status = 'qr';
      qrcode.generate(qr, { small: true }, (art) => {
        asciiQR = art;
      });
      log('New QR generated');
    }
    if (connection === 'open') {
      status = 'paired';
      pairedAs = sock?.user?.id ?? 'unknown';
      log(`PAIRED as ${pairedAs} — credentials saved to ${AUTH_DIR}`);
      setTimeout(() => process.exit(0), 8000);
    } else if (connection === 'close' && status !== 'paired') {
      const code = lastDisconnect?.error?.output?.statusCode;
      if (code === DisconnectReason.loggedOut) {
        status = 'logged_out';
        log('Logged out by WhatsApp — aborting');
        setTimeout(() => process.exit(1), 2000);
      } else {
        // QR cycle exhausted (408) or restart required after scan (515):
        // recreate the socket; with saved creds this completes the pairing.
        log(`Connection closed (code=${code}) — recreating socket`);
        setTimeout(
          () => createSocket().catch((e) => log(`recreate failed: ${e.message}`)),
          2000,
        );
      }
    }
  });
}

http
  .createServer((req, res) => {
    const body =
      status === 'paired'
        ? `<h1 style="color:#0a7d32">&#9989; Emparejado (${pairedAs})</h1><p>Ya puedes cerrar esta pesta&ntilde;a. Las credenciales quedaron guardadas.</p>`
        : status === 'logged_out'
          ? `<h1 style="color:#b00">Sesi&oacute;n rechazada</h1><p>WhatsApp cerr&oacute; la sesi&oacute;n. Relanza el script.</p>`
          : asciiQR
            ? `<h1>Escanea con WhatsApp</h1><p>M&oacute;vil &rarr; WhatsApp &rarr; Ajustes &rarr; Dispositivos vinculados &rarr; Vincular un dispositivo</p><pre style="font-family:Consolas,'Courier New',monospace;font-size:14px;line-height:1.05;display:inline-block;background:#fff;color:#000;padding:16px;border-radius:8px">${asciiQR}</pre><p style="color:#666">El QR rota cada ~20 s; esta p&aacute;gina se refresca sola.</p>`
            : `<h1>Generando QR&hellip;</h1>`;
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(
      `<!doctype html><meta http-equiv="refresh" content="4"><body style="font-family:system-ui;background:#f5f5f5;text-align:center;padding:24px">${body}</body>`,
    );
  })
  .listen(PORT, () => log(`QR page: http://localhost:${PORT}`));

createSocket().catch((e) => {
  log(`fatal: ${e.message}`);
  process.exit(1);
});

setTimeout(() => {
  if (status !== 'paired') {
    log(`Timeout ${TIMEOUT_MIN}min without pairing — exiting`);
    process.exit(1);
  }
}, TIMEOUT_MIN * 60 * 1000);

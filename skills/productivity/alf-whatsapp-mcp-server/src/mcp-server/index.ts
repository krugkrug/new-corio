import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { getWhatsAppClient } from './whatsapp.js';
import { registerTools } from './tools.js';

function log(message: string): void {
  process.stderr.write(`[whatsapp-mcp] ${message}\n`);
}

function logError(message: string, error?: unknown): void {
  const detail = error instanceof Error ? error.message : String(error ?? '');
  process.stderr.write(
    `[whatsapp-mcp] ERROR: ${message}${detail ? ` -- ${detail}` : ''}\n`,
  );
}

async function main(): Promise<void> {
  const sessionName = process.env.WHATSAPP_SESSION_NAME ?? 'default';

  log(`Starting WhatsApp MCP server (session: ${sessionName})`);

  const server = new Server(
    { name: 'whatsapp-mcp', version: '1.0.0' },
    { capabilities: { tools: {} } },
  );

  const client = getWhatsAppClient(sessionName);

  registerTools(server, client);
  log('MCP tools registered: whatsapp_list_groups, whatsapp_get_messages, whatsapp_export_chat, whatsapp_search_messages, whatsapp_group_info, whatsapp_send_message, whatsapp_reply_to_message');

  // Connect the MCP transport BEFORE initializing WhatsApp: the Baileys ready
  // wait can take 30s+, which overruns the MCP client's startup handshake
  // timeout. Tools called before the client is ready fail with a clear
  // "not ready" error from ensureReady().
  const transport = new StdioServerTransport();
  await server.connect(transport);
  log('MCP server connected via stdio transport');

  log('Initializing WhatsApp client in background...');
  client
    .initialize()
    .then(() => log('WhatsApp client authenticated and ready'))
    .catch((error) => {
      logError('Failed to initialize WhatsApp client', error);
      process.exit(1);
    });

  const shutdown = async (signal: string): Promise<void> => {
    log(`Received ${signal}, shutting down...`);

    try {
      await client.destroy();
      log('WhatsApp client destroyed');
    } catch (error) {
      logError('Error destroying WhatsApp client', error);
    }

    try {
      await server.close();
      log('MCP server closed');
    } catch (error) {
      logError('Error closing MCP server', error);
    }

    process.exit(0);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  log('WhatsApp MCP server is running. Waiting for tool calls...');
}

main().catch((error) => {
  logError('Fatal error in main', error);
  process.exit(1);
});

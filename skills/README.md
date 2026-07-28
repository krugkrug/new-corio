# skills/

Todos los plugins y skills viven bajo `skills/<dominio>/<nombre>/`, agrupados
por dominio:

- `legal/` — marco general (`legal/legal`) + revisiones jurídicas específicas.
- `finance/` — revisiones financieras (cuentas anuales, due diligence).
- `coding/` — workflow de desarrollo con IA.
- `writing/` — voz de escritura.
- `productivity/` — asistente familiar (`alfssist`), triaje de email
  (`alfmail`), triaje de WhatsApp (`alf-whatsapp-mcp-server`) y utilidades
  transversales (`handoff`).
- `corio/` — Coriolis Capital (search fund); tiene su propia subcarpeta
  `skills/` interna con varias skills del embudo de originación.

Cada plugin sigue el mismo patrón mínimo:

```
skills/<dominio>/<nombre>/
  .claude-plugin/plugin.json
  SKILL.md              (o su propia estructura de plugin, si trae comandos/servidor)
  references/            (opcional)
```

Y se registra como entrada independiente en `.claude-plugin/marketplace.json`
(raíz del repo), con `"source": "./skills/<dominio>/<nombre>"` apuntando a la
carpeta que contiene `.claude-plugin/plugin.json`.

Algunos plugins (`alfmail`, `alf-whatsapp-mcp-server`) traen más que el skill
puro — servidor MCP, backend, `HANDOFF.md` propio — pero igualmente viven bajo
`skills/`, no en la raíz del repo.

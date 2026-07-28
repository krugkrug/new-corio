---
description: Triage today's inbox — prioritized summary with reply drafting
---

Invoke the `email-triage` skill to scan the inbox and produce a prioritized triage.

1. Load the email-triage skill
2. Execute the full triage workflow, verifying message by message that each item is genuinely still in the inbox
3. Present results as the interactive two-column triage table (Cowork artifact `triage-inbox`), not a chat markdown list
4. Actions (Archivar / Responder / Borrar / Reenviar) are chosen per row in the table and only execute in bulk when the user clicks "Ejecutar acciones" there

If the user provides an argument, filter accordingly:
- `$ARGUMENTS` = "work" → only work-domain emails
- `$ARGUMENTS` = "personal" → exclude work-domain emails
- No argument → full inbox triage

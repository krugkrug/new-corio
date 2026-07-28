---
name: email-triage
description: >
  This skill should be used when the user asks to "check email", "triage my inbox",
  "check my email", "morning email", "inbox summary", or invokes /email or /summary.
  Verifies which emails are genuinely still in the inbox, summarizes each one, and
  presents them in an interactive two-column table (Cowork artifact) with per-row
  actions (archive / reply / delete / forward) that only execute in bulk when the
  user explicitly clicks "Ejecutar".
---

# Email Triage Skill

## Overview

Scan Gmail for what is genuinely still in the inbox right now, verify it message by
message (raw search results can be stale), summarize each email, and present
everything as an interactive triage table — not a chat markdown list. Nothing is
archived, replied to, deleted, or forwarded until the user reviews the table and
clicks the single "Ejecutar acciones" button at the bottom.

## Step 0 — Load Context

No family-assistant/reference-file skill is configured for this account — classification and summarization run on sender domain and content patterns (see Step 2).

Known context for this inbox (Alfredo Sánchez Bella):
- Personal/despacho address: `alfredo@sanchezbella.com`
- Personal address (also receives mail): `asbs26@gmail.com`
- Search fund: Coriolis Capital (`@corioliscap.com`)
- Banking relationships: BBVA (`@bbva.com`), Banco Santander (`@gruposantander.es`, e.g. `jmarotoa@gruposantander.es`)
- School: Saint Chaumond / Sainte Cécile (`@saintchaumond.es`)
- Gmail label `Claude-Inbox` is reserved for the `pipeline`/claudedash task queue — **always exclude it** from triage so tasks aren't double-processed
- Gmail labels `Corio` and `GT` (Grand Tibidabo) mark deal/portfolio-related threads — treat as work context, evaluate content normally

## Step 1 — Scan and verify the inbox

Fetch whatever is currently in the inbox, read or unread, up to the 20 most recent — no `newer_than` time window by default (the point is "what's really there right now", not a rolling 24h window). If the user asks for "today" or "esta semana" specifically, you may narrow with `newer_than:12h` / `newer_than:3d`, but the verification step below still applies.

```
query: in:inbox -label:Claude-Inbox
view: THREAD_VIEW_MINIMAL
pageSize: 50
```

**Critical — verify before showing anything.** `search_threads` matches at the thread level: a thread can appear in results because *some* older message in it once had the `INBOX` label, even though the actual current message no longer does (this happens constantly on this account, since Alfredo replies and Gmail archives fast). Never trust the raw search result as-is.

For every candidate message, confirm it's really there with a fresh per-message check:

```
get_message { messageId, messageFormat: METADATA_ONLY }
```

Only keep messages whose `labelIds` currently include `INBOX`. Take the latest verified message per thread as that thread's row, sort by date descending, cap at 20. If a raw search hit turns out not to carry `INBOX` on verification, silently drop it — don't report it as an inbox item.

## Step 2 — Summarize each verified email

For each verified message, fetch full content (`get_message`, `FULL_CONTENT`) and produce:

- **Resumen** — exactly 2 short lines with concrete facts as they appear in the email: figures, dates, names, references. No generalities like "pide información".
- **Próximos pasos** — bullets of what actually needs to happen next, or `["ninguna"]` if the email is purely informational.
- **Borrador** — a short suggested reply in the same language as the email, using only facts present in the email (never invent data). Leave empty if a reply doesn't make sense for this email.

## Step 3 — Present as an interactive table (default format, not a chat list)

Do not present results as a markdown three-tier list in chat, and do not write this HTML from scratch each time. This plugin ships the tested implementation at `skills/email-triage/assets/triage-inbox.html` — use it as-is:

1. Read `skills/email-triage/assets/triage-inbox.html`.
2. It contains a placeholder constant `const GMAIL = 'GMAIL_MCP_PREFIX_PLACEHOLDER';`. Find the actual currently-connected Gmail MCP tool prefix in this session's tool list (look for the `search_threads` / `get_message` / `create_draft` / `unlabel_thread` / `apply_sensitive_message_label` / `list_labels` tools — their shared prefix is `mcp__<connector-instance-id>__`). Replace the placeholder with that exact prefix. **Never hardcode a specific connector id back into the checked-in asset file** — the id can change if Alfredo reconnects Gmail, so resolve it fresh every session and only substitute it in the copy you hand to `create_artifact`.
3. It also contains the line `const GT_CONTEXT = 'PROJECT_CONTEXT_GT_PLACEHOLDER';`. Read `skills/email-triage/references/grand-tibidabo.md`; if it has real content (not just the empty section template), replace that entire line with `const GT_CONTEXT = <the file's content as a JSON string literal>;` (i.e. `JSON.stringify` the content so newlines/quotes are escaped). If the file is missing or still the empty template, leave the placeholder untouched — the template detects it and simply skips project context. The artifact resolves the Gmail label `GT`'s id via `list_labels` on load and injects this context into summarization and draft-regeneration prompts **only for emails whose thread carries the `GT` label**, so drafts on Grand Tibidabo threads reflect the project's real state, terminology, and per-person tone. The same pattern can be extended to other projects (e.g. a `Corio` reference file) by mirroring these two pieces.
4. Write that substituted copy to a scratch file and call `mcp__cowork__create_artifact` with `id: "triage-inbox"` (reuse this id every time so repeated triages update the same view instead of spawning duplicates) and `mcp_tools` listing the six Gmail tools above.

The template implements, as shipped:
- One row per verified email. **Left column**: subject, sender, date, the 2-line resumen, the próximos pasos bullets (or "Ninguna — solo informativo"), and four action buttons: **Archivar / Responder / Borrar / Reenviar**. Default selection is always **"No hacer nada"**.
- **Right column**: an editable textarea prefilled with the borrador, a free-text "instrucciones" box, and a "Regenerar borrador" button that redraws the draft using those instructions.
- Below the resumen, a **"Ver correo completo"** toggle reveals the full plaintext body (already fetched with the message, no extra call) and collapses back to "Ocultar correo completo".
- When **Reenviar** is selected, a prefix selector (`drive gt` / `drive corio`) — the forward goes to `alfredo@sanchezbella.com` with the body starting with the chosen prefix.
- A single **"Ejecutar acciones"** button at the bottom. Clicking it processes every row in bulk in one pass — no further per-row confirmation, since the click itself is the confirmation. Rows left on "No hacer nada" are skipped.
- The artifact does its own live verification and summarization on load (calling `search_threads` + `get_message` + `askClaude` directly from the page), so Steps 1–2 above happen inside the artifact itself once it's built — you don't need to pre-fetch and hand it data. Summarization is batched (up to 5 emails per `askClaude` call) to cut round trips, and `callTool` retries with exponential backoff on rate-limit errors.

In chat, just give a one-line count and open/point to the artifact — don't paste the table as markdown text. If the template needs a genuine behavior change (not just the connector id), edit `skills/email-triage/assets/triage-inbox.html` in the plugin repo and commit it, so the fix persists for next time instead of being patched ad hoc in the copy handed to `create_artifact`. Whenever the template file changes, bump `TEMPLATE_VERSION` in its `<script>` block — the artifact shows it as a small badge under the title, so a stale cached/installed copy is obvious at a glance instead of silently showing old behavior.

**Empty inbox:** if 0 messages verify as currently carrying `INBOX`, say so plainly, even if the raw search suggested otherwise — the verified count is always the authoritative one.

## Step 4 — Bulk execution semantics (fires when the user clicks "Ejecutar" in the table)

- **Archivar** → `unlabel_thread(threadId, ['INBOX'])`
- **Borrar** → `apply_sensitive_message_label(messageId, 'TRASH')` — recoverable for 30 days, nothing is permanently deleted
- **Responder** → `create_draft(to: [sender], subject, body: <edited draft>, replyToMessageId: messageId)`
- **Reenviar** → `create_draft(to: ['alfredo@sanchezbella.com'], subject: 'Fwd: ' + original subject, body: <prefix> + '\n\n' + <edited draft or original content>)`
- **No hacer nada** → row untouched

**Known limitation to always disclose:** this Gmail connector has no send tool, only `create_draft`. "Responder" and "Reenviar" always leave a draft in Gmail for Alfredo to open and send himself — they never send automatically, regardless of what the table's copy implies. Say this explicitly whenever presenting or building the table, since any downstream automation (e.g. filing to Drive via a forwarded "drive gt"/"drive corio" email) depends on the message actually being sent, not just drafted.

### Email voice guidelines (for both the auto-generated borrador and any manual draft)

- Direct and concise — no filler, no over-explaining or over-apologizing
- Warm but professional; uses first names
- Writes in the recipient's language (Spanish or English, matching the thread)
- Signs off "Alfredo Sánchez-Bella" — for formal/external threads, include the block signature seen in Sent mail:
  ```
  Alfredo Sánchez-Bella
  +34629741202
  alfredo@sanchezbella.com
  C/ Marqués de Valdecilla 26 bis
  28002 Madrid
  ```
- For quick internal/informal replies, a plain first-name sign-off is fine

## Edge Cases

- **Empty inbox (verified):** "0 correos verificados en bandeja ahora mismo — todo lo reciente ya está archivado o resuelto." Note explicitly if the raw search suggested otherwise before verification corrected it.
- **All informational (ninguna próximos pasos):** still show them in the table; default action stays "No hacer nada".
- **Very high volume (50+ inbox hits before verification):** verification will naturally cap the table at 20 rows (most recent verified) — mention that older inbox items exist beyond the top 20 if the raw count was much higher.
- **Thread context:** always read the full thread before drafting a reply, not just the latest message — earlier messages often carry data (account numbers, references, amounts) the reply needs.

## What This Skill Does NOT Do

- Does not maintain its own contact list (optionally reads from family-assistant or similar)
- Does not save output to files (the artifact is the persisted view; chat stays ephemeral)
- Does not send emails — only drafts, and only for rows explicitly marked Responder/Reenviar and then executed via the table's Ejecutar button
- Does not modify labels or filters outside the Archivar/Borrar actions explicitly triggered by Ejecutar
- Does not permanently delete anything — Borrar moves to Trash (30-day recovery)
- Does not touch any row left on "No hacer nada"

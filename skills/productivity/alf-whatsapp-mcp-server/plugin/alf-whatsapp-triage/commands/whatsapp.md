---
name: whatsapp
description: WhatsApp group chat intelligence — pull messages and produce a structured briefing
allowed-tools: mcp__*__whatsapp_*, Bash, Read, Write, Edit, WebSearch
---

## WhatsApp Group Chat Triage

When the user says `/whatsapp`, pull messages from their WhatsApp groups and produce
an intelligence briefing. Use the WhatsApp MCP tools to list groups, fetch messages,
and search across conversations.

### Default Behavior

1. Call `whatsapp_list_groups` to see all available groups
2. Ask the user which groups to analyze (or use their configured defaults)
3. For each selected group, call `whatsapp_get_messages` (last 48 hours by default)
4. Analyze the messages using the chat intelligence processor
5. Scan for celebrations (see below) and flag any still unanswered
6. Present a structured briefing with themes, ideas, opportunities, and action items

### Celebration detection

While scanning messages, flag anything that is a celebration or good-news moment for
someone in the group — not just addressed to the user:

- Birthdays / santos ("feliz cumple", "feliz santo", "muchas felicidades")
- Good news (alta médica, resultado benigno, aprobado un examen, ascenso, nacimiento,
  compromiso/boda, logro deportivo o profesional de alguien del grupo)
- Group celebrating collectively (gol, victoria, buena noticia familiar)

For each one found, check whether the user has already replied in that thread. Put
unanswered ones in a **🎉 Celebraciones sin contestar** section at the top of the
briefing, above everything else, and explicitly remind the user to reply **efusivamente**
— not a brief acknowledgment, but matching or exceeding the group's energy (emoji,
enthusiasm, no delay). This is a standing behavioral nudge for this user: his default
reply style tends to be brief and functional, which reads as understated in exactly
these moments.

### Tips

- Use `whatsapp_search_messages` to find specific topics across all groups
- Use `whatsapp_export_chat` for full conversation exports
- When multiple groups are analyzed, include cross-group synthesis

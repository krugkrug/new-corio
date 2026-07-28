---
name: handoff
description: Create or read a short "handoff document" (HANDOFF.md) so work can move cleanly between Claude Chat, Cowork, and Claude Code, since these surfaces don't automatically share memory or context with each other. Use this skill whenever the user wants to wrap up a session and continue it elsewhere ("prepare a handoff", "close this out so I can continue in Cowork/Code", "summarize this so I don't lose context", "let's switch tools"), whenever the user is starting work on a project and might be resuming earlier work (check for an existing HANDOFF.md before diving in), or whenever the user explicitly says "/handoff", "handoff doc", or asks how to keep context when switching between Claude surfaces. Also use this when the user asks to set up standing instructions so handoffs happen automatically at the start/end of every session in a project.
---

# Handoff

## Why this exists

Claude Chat, Cowork, and Claude Code don't share a session or memory automatically. If someone plans a project in Chat, then wants Cowork or Claude Code to pick it up, all the reasoning and decisions from that conversation are trapped there unless something carries them over. (The one exception is Claude Code moving between local, SSH, and web sessions of itself — that already has a native mechanism, "Continue in" / `--teleport`, so don't build that here. This skill is for crossing between Chat/Cowork/Code, not within Code.)

Pasting a full transcript into the next session doesn't work well — it's too much noise, and it's genuinely possible to give a session *too much* context, not just too little. What actually helps the next session is a short, synthesized document: what this is about, what's already been decided and why, what files matter, and what's left to do. That's what this skill produces and consumes.

## Write mode — creating or updating a handoff

Trigger this when the user is wrapping up work and wants to continue it in another surface (or just wants a checkpoint in case the conversation gets long or is closed).

**1. Find the right project folder.** The handoff document should live at the root of whatever folder holds the actual project — the Cowork project folder, or the root of the repo if this is a coding project. If it's ambiguous which folder that is, ask rather than guessing; writing the file to the wrong place defeats the purpose.

**2. Write `HANDOFF.md` using the template** in `assets/HANDOFF_TEMPLATE.md`. The critical skill here is synthesis, not transcription:

- Summarize the *why* behind decisions in a sentence or two each — not the back-and-forth that led there.
- List files and resources by path or link, not by re-describing their contents.
- Keep "next steps" to concrete, actionable items — not vague notes.
- If in doubt about whether to include something, leave it out. A handoff doc that takes 30 seconds to read and gets the next session 90% oriented beats one that's exhaustive but takes 5 minutes to read.

**3. If `HANDOFF.md` already exists**, read it first and update it rather than overwriting blindly: carry forward open items that are still open, mark or remove ones that got resolved, and add what's new. Treat it as a living document tied to the project, not a fresh snapshot every time.

**4. Check whether this is a git repository** (a `.git` folder at or above the project root). This matters because a cloud/remote Claude Code session only ever sees what's been *pushed* — not local uncommitted changes. So:

- If it's a git repo: stage and commit `HANDOFF.md` (e.g. `git add HANDOFF.md && git commit -m "Update handoff doc"`). Then ask the user whether to push now — don't push automatically without asking, since they may not want to publish yet, but do explain *why* it matters if they're planning to hand this off to a remote/cloud Code session.
- If it isn't a git repo (e.g. a plain folder in a Cowork project): just save the file. Nothing else to do.

**5. Tell the user where it went and confirm it's ready** — a one-line confirmation is enough, not a re-statement of everything in the doc (they can read it).

## Read mode — resuming from a handoff

Trigger this at the start of work in a project folder, before diving into the user's request, whenever it's plausible this project has been worked on before (which is most of the time — err toward checking).

- Look for `HANDOFF.md` at the project root.
- If it exists, read it before doing anything else. Briefly acknowledge what you picked up in a sentence — e.g. "Retomando desde el handoff: ya se decidió X, quedaba pendiente Y" — so the user knows you're oriented, then proceed with their actual request.
- If it doesn't exist, don't make a thing of it — just proceed normally. Not every project needs a handoff doc, and this shouldn't feel like a gate.

## Making it automatic

The manual trigger (`/handoff` or asking for one) works, but it's better as a standing habit than something to remember every time. Offer to add a short standing instruction so it happens without being asked:

**For a Cowork project** — add to the project's custom instructions:
> At the start of a session, check if `HANDOFF.md` exists in this project's folder and read it first. When wrapping up significant work, update `HANDOFF.md` following the handoff skill's template.

**For a Claude Code repo** — add to `CLAUDE.md` at the repo root:
> Check for `HANDOFF.md` at the start of a session and read it before starting work. Update it when closing out significant work, keeping it synthesized rather than a full transcript.

Mention this once when it seems relevant (e.g., after creating a first handoff doc for a project) rather than every single time this skill triggers.

## What this skill is not for

Don't use this for ordinary note-taking, meeting minutes, or documentation the user wants for its own sake — those are their own thing (and may call for the docx or pdf skill instead). This is specifically the mechanism for continuity across Claude surfaces on the same project.